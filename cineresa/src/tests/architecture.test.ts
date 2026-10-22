import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

// Test d'architecture hexagonale : on analyse les imports de chaque fichier
// et on vérifie que les dépendances respectent le sens domain ← application ← adapters.

const SRC = path.resolve(__dirname, "..");

type Layer = "domain" | "application" | "adapters" | "root";

interface SourceFile {
  file: string; // chemin relatif à src/, ex: "domain/utils/PriceCalculator.ts"
  layer: Layer;
  imports: string[]; // imports internes résolus (relatifs à src/)
  packages: string[]; // imports de modules externes (express, fs, ...)
}

function listTsFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "tests" ? [] : listTsFiles(full);
    return entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts") ? [full] : [];
  });
}

function layerOf(file: string): Layer {
  const top = file.split("/")[0];
  return top === "domain" || top === "application" || top === "adapters" ? top : "root";
}

function resolveImport(fromFile: string, spec: string): string {
  const abs = path.resolve(path.dirname(path.join(SRC, fromFile)), spec);
  const candidates = [abs, `${abs}.ts`, path.join(abs, "index.ts")];
  const found = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) ?? `${abs}.ts`;
  return path.relative(SRC, found).split(path.sep).join("/");
}

function parse(absFile: string): SourceFile {
  const file = path.relative(SRC, absFile).split(path.sep).join("/");
  const code = fs.readFileSync(absFile, "utf-8");
  const specs = [...code.matchAll(/(?:import|export)\s[^;]*?from\s+["']([^"']+)["']/g)].map((m) => m[1]);

  return {
    file,
    layer: layerOf(file),
    imports: specs.filter((s) => s.startsWith(".")).map((s) => resolveImport(file, s)),
    packages: specs.filter((s) => !s.startsWith(".")).map((s) => s.replace(/^node:/, "")),
  };
}

const files = listTsFiles(SRC).map(parse);
const inLayer = (layer: Layer) => files.filter((f) => f.layer === layer);
const under = (prefix: string) => files.filter((f) => f.file.startsWith(prefix));

function violations(subjects: SourceFile[], isForbidden: (target: string) => boolean): string[] {
  return subjects.flatMap((f) => f.imports.filter(isForbidden).map((target) => `${f.file} → ${target}`));
}

describe("Architecture - sanity check", () => {
  test("le scanner trouve les trois couches", () => {
    expect(inLayer("domain").length).toBeGreaterThan(0);
    expect(inLayer("application").length).toBeGreaterThan(0);
    expect(inLayer("adapters").length).toBeGreaterThan(0);
  });
});

describe("Architecture - couche domaine", () => {
  test("le domaine ne dépend pas de la couche application", () => {
    expect(violations(inLayer("domain"), (t) => t.startsWith("application/"))).toEqual([]);
  });

  test("le domaine ne dépend pas des adapters", () => {
    expect(violations(inLayer("domain"), (t) => t.startsWith("adapters/"))).toEqual([]);
  });

  test("le domaine n'utilise aucune librairie externe (framework, I/O)", () => {
    const external = inLayer("domain").flatMap((f) => f.packages.map((p) => `${f.file} → ${p}`));
    expect(external).toEqual([]);
  });

  test("le calcul de prix est une fonction pure du domaine", () => {
    const calculator = files.find((f) => f.file === "domain/utils/PriceCalculator.ts");
    expect(calculator).toBeDefined();
    expect(calculator!.packages).toEqual([]);
    expect(calculator!.imports.every((t) => t.startsWith("domain/"))).toBe(true);
  });
});

describe("Architecture - couche application", () => {
  test("l'application ne dépend pas des adapters", () => {
    expect(violations(inLayer("application"), (t) => t.startsWith("adapters/"))).toEqual([]);
  });

  test("l'application n'importe ni express ni le système de fichiers", () => {
    const forbidden = ["express", "fs", "path", "dotenv", "http"];
    const external = inLayer("application").flatMap((f) =>
      f.packages.filter((p) => forbidden.includes(p)).map((p) => `${f.file} → ${p}`),
    );
    expect(external).toEqual([]);
  });

  test("les ports ne dépendent pas des implémentations de use cases", () => {
    expect(violations(under("application/ports/"), (t) => t.startsWith("application/usecases/"))).toEqual([]);
  });

  test("les DTO ne dépendent ni des ports ni des use cases", () => {
    expect(
      violations(under("application/dto/"), (t) =>
        t.startsWith("application/ports/") || t.startsWith("application/usecases/"),
      ),
    ).toEqual([]);
  });

  test("chaque use case implémente un port entrant", () => {
    const missing = under("application/usecases/")
      .filter((f) => !f.imports.some((t) => t.startsWith("application/ports/in/")))
      .map((f) => f.file);
    expect(missing).toEqual([]);
  });
});

describe("Architecture - adapters", () => {
  test("les adapters passent par les ports, jamais par les use cases concrets", () => {
    expect(violations(inLayer("adapters"), (t) => t.startsWith("application/usecases/"))).toEqual([]);
  });

  test("les adapters ne dépendent pas les uns des autres", () => {
    const crossAdapter = inLayer("adapters").flatMap((f) => {
      const ownFamily = f.file.split("/")[1];
      return f.imports
        .filter((t) => t.startsWith("adapters/") && t.split("/")[1] !== ownFamily)
        .map((t) => `${f.file} → ${t}`);
    });
    expect(crossAdapter).toEqual([]);
  });
});

describe("Architecture - composition root", () => {
  test("seul server.ts instancie les use cases concrets", () => {
    const outsideApp = files.filter((f) => f.layer !== "root" && f.layer !== "application");
    expect(violations(outsideApp, (t) => t.startsWith("application/usecases/"))).toEqual([]);
  });

  test("server.ts câble bien adapters et use cases", () => {
    const server = files.find((f) => f.file === "server.ts");
    expect(server).toBeDefined();
    expect(server!.imports.some((t) => t.startsWith("adapters/"))).toBe(true);
    expect(server!.imports.some((t) => t.startsWith("application/usecases/"))).toBe(true);
  });
});

describe("Architecture - dépendances circulaires", () => {
  test("aucun cycle d'import entre les fichiers", () => {
    const graph = new Map(files.map((f) => [f.file, f.imports]));
    const cycles: string[] = [];
    const state = new Map<string, "visiting" | "done">();

    const visit = (node: string, stack: string[]) => {
      if (state.get(node) === "done") return;
      if (state.get(node) === "visiting") {
        cycles.push([...stack.slice(stack.indexOf(node)), node].join(" → "));
        return;
      }
      state.set(node, "visiting");
      for (const next of graph.get(node) ?? []) visit(next, [...stack, node]);
      state.set(node, "done");
    };

    for (const file of graph.keys()) visit(file, []);
    expect(cycles).toEqual([]);
  });
});
