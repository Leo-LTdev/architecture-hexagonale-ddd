# architecture-hexagonale-ddd

Refactoring de **CinéResa**, une API de réservation de places de cinéma, d'un code legacy monolithique vers une **architecture hexagonale** et un modèle **DDD**. Projet réalisé dans le cadre du module DDD — Ynov B3.

## Documentation

- [Document d'Architecture Technique (DAT)](docs/DAT.md) — choix techniques, architecture, diagrammes UML, API, tests, utilisation
- [Index de la documentation](docs/README.md)

## Contenu du dépôt

| Dossier | Contenu |
| --- | --- |
| [`cineresa/`](cineresa) | Application refactorée (hexagonale + DDD) |
| [`cineresa-legacy/`](cineresa-legacy) | Version d'origine, sert de référence fonctionnelle |
| [`tp1/`](tp1) | Sujet et audit du legacy |
| [`TP2/`](TP2), [`TP4/`](TP4) | Sujets et fichiers fournis des TP |
| [`docs/`](docs) | Documentation technique |

## Démarrage rapide

```bash
cd cineresa
npm install
npm start      # http://localhost:3000
npm test       # tests unitaires + test d'architecture
```

Détails dans la section [Installation et utilisation](docs/DAT.md#11-installation-et-utilisation) du DAT.

## Membres du projet

| Membre | GitHub |
| --- | --- |
| Léo | [@Leo-LTdev](https://github.com/Leo-LTdev) |
| Corentin H. | [@corentin-cpp](https://github.com/corentin-cpp) |
| Stiximir | _lien GitHub à compléter_ |
