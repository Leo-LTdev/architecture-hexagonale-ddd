import path from "path";
import { defineConfig } from "vitest/config";

// Mêmes alias que dans tsconfig.json (compilerOptions.paths)
export default defineConfig({
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "src/domain"),
      "@application": path.resolve(__dirname, "src/application"),
      "@adapters": path.resolve(__dirname, "src/adapters"),
    },
  },
});
