# TP5 — Document d'architecture technique de CinéResa

## Objectif

Rédiger le **document d'architecture technique (DAT)** de **votre** CinéResa : expliquer l'architecture interne, un scénario clé et un choix structurant, avec des **diagrammes UML** (composants et séquence) maintenus sous forme de code. C'est la dernière étape du fil rouge.

## Résultat attendu

Dans votre dépôt CinéResa (le même depuis le TP1) :

```
docs/
├── DAT.md                     le document (à partir de DAT_modele.md)
├── diagrams/                  sources PlantUML (.puml) ou Mermaid (.mmd) + exports PNG/SVG
└── adr/
    └── 001-....md
```

## Point de départ

- Votre code à l'issue du TP4.
- Le modèle `DAT_modele.md` : plan, squelettes PlantUML et modèle d'ADR prêts à remplir.

## Fichiers fournis

| Fichier | Rôle |
|---|---|
| `DAT_modele.md` | plan du DAT ; chaque section indique ce qui est attendu, avec un exemple sur un autre domaine (bibliothèque) et des squelettes PlantUML |

## Consignes

1. Copiez `DAT_modele.md` dans `docs/DAT.md` ; supprimez les exemples au fur et à mesure.
2. **Contexte** (section 1) : le besoin, les utilisateurs et le périmètre, en quelques lignes.
3. **Exigence qualité** (section 2) : rédigez **un** scénario de qualité complet (source, stimulus, environnement, artefact, réponse, mesure).
4. **Glossaire** (section 3) : une dizaine de termes du métier, avec leur nom dans le code.
5. **Vue logique** (section 4) : le **diagramme de composants UML** du contexte Réservation **tel qu'il est dans votre code** (adapters, application, domaine, ports, dépendances vers le cœur).
6. **Vue dynamique** (section 5) : **un diagramme de séquence UML** d'un **cas d'erreur** (par exemple une réservation refusée), avec un fragment `alt`.
7. **Décision** (section 6) : **un ADR** dans `docs/adr/` — « Booking dans l'agrégat Screening ou agrégat séparé ? ».

## Points de vigilance

- Le DAT décrit **votre** code : un correcteur doit retrouver dans `src/` chaque composant du diagramme.
- **Une question par diagramme**, un titre et une légende sur chacun.
- Les noms du glossaire, des diagrammes et du code sont **les mêmes**.
- Les flèches de dépendance pointent vers le métier, pas dans le sens des appels.
- Un ADR sans alternative ni inconvénient n'est pas un ADR.

## Critères de réussite

- [ ] Sections 1 à 6 remplies pour CinéResa
- [ ] Un scénario de qualité complet et mesurable
- [ ] Un glossaire d'une dizaine de termes, avec les mêmes noms que dans le code
- [ ] Diagramme de composants UML conforme au code du dépôt
- [ ] Un diagramme de séquence UML d'un cas d'erreur, avec fragment `alt`
- [ ] Un ADR avec au moins deux options, la décision et ses conséquences (+ et -)
- [ ] Sources des diagrammes dans `docs/diagrams/`

## Rendu

En binôme, dans votre dépôt CinéResa (le même que pour les TP1 à TP4).
