# architecture-hexagonale-ddd

Refactoring de **CinéResa**, une API de réservation de places de cinéma, d'un code legacy monolithique vers une **architecture hexagonale** et un modèle **DDD**. Projet réalisé dans le cadre du module DDD — Ynov B3.

| Dossier | Contenu |
| --- | --- |
| [`cineresa/`](cineresa) | Application refactorée (hexagonale + DDD) — état final après le TP4 |
| [`cineresa/docs/`](cineresa/docs) | TP5 : [DAT](cineresa/docs/DAT.md), [diagrammes](cineresa/docs/diagrams), [ADR](cineresa/docs/adr) |
| [`cineresa-legacy/`](cineresa-legacy) | Version d'origine, référence du comportement attendu |
| [`tp1/`](tp1) | TP1 : audit du legacy ([AUDIT.md](tp1/AUDIT.md)) et découpage en couches |
| [`TP2/`](TP2), [`TP3/`](TP3), [`TP4/`](TP4), [`TP5/`](TP5) | Sujets et fichiers fournis |

## Démarrage rapide

```bash
cd cineresa
npm install
npm start            # persistance en mémoire — http://localhost:3000
npm run start:json   # persistance dans data/db.json
npm test
```

## Membres du projet

| Membre | GitHub |
| --- | --- |
| Léo | [@Leo-LTdev](https://github.com/Leo-LTdev) |
| Corentin H. | [@corentin-cpp](https://github.com/corentin-cpp) |
