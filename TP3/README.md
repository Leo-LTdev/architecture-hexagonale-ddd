# TP3 — Refactoring complet et changement d'adapter

## Objectif

Terminer la migration de CinéResa vers l'architecture hexagonale (tous les cas d'utilisation), puis **prouver** que l'architecture tient ses promesses : brancher une persistance **fichier JSON** à la place de la mémoire **sans modifier une seule ligne du cœur**.

## Résultat attendu

- Les 4 routes de l'API legacy fonctionnent à l'identique, servies par 4 use cases.
- `npm start` démarre avec la persistance en mémoire, `npm run start:json` avec le fichier `data/db.json`.
- Une **même suite de tests de contrat** valide les deux adapters de persistance.
- Un test HTTP de bout en bout (supertest) parcourt : lister → réserver → consulter → annuler.

## Point de départ

Votre dépôt à l'issue du TP2, et le projet `cineresa-legacy` comme référence du comportement attendu.

## Fichiers fournis

| Fichier | Rôle |
|---|---|
| `fournis/src/adapters/out/persistence/JsonFile.ts` | lecture / écriture du fichier `data/db.json` et types du format historique |
| `fournis/test/bookingRepository.contract.test.ts` | suite de **tests de contrat** de `BookingRepository`, jouée sur l'adapter mémoire et l'adapter JSON |
| `fournis/test/http.test.ts` | test HTTP de bout en bout (supertest) : lister → réserver → consulter → annuler |

Ces fichiers servent à la **partie B** : copiez-les dans votre dépôt au début de la partie B (avant, ils ne compilent pas, car ils utilisent l'adapter JSON et `src/container.ts`). Les tests fournis imposent les noms : `InMemoryBookingRepository`, `JsonBookingRepository`, `InMemoryScreeningRepository`, `FakePaymentGateway`, et une fonction `buildApp(adapters)` exportée par `src/container.ts`.

Reprenez aussi `data/db.json` et `scripts/seed.ts` du legacy : **le format du fichier ne doit pas changer** (dates en chaînes ISO, prix unitaire dans le champ `price`).

## Consignes

Le TP se fait en deux parties : la **partie A** après le cours sur le refactoring, la **partie B** en fin de journée, après le cours sur le DDD.

### Partie A — Migrer tous les cas d'utilisation (en mémoire)

1. Ajoutez les ports entrants `CancelBooking`, `ListUpcomingScreenings` et `ListMyBookings`, et leurs implémentations dans `application/usecases`.
2. Ajoutez la règle d'annulation (déjà annulée, moins de 2h avant la séance) dans le domaine, sous forme de fonction pure.
3. Complétez les ports sortants au strict nécessaire (par exemple `findById`, `findByEmail` sur les réservations, `findStartingAfter` sur les séances, `bookingCancelled` sur le notifier) et mettez à jour les adapters en mémoire.
4. Écrivez un adapter HTTP unique qui reçoit les 4 use cases, avec un utilitaire pour ne pas répéter le `try/catch` dans chaque route.
5. Écrivez les tests du use case d'annulation, notamment la limite des 2h, avec une horloge figée.
6. Supprimez les dossiers `src/presentation`, `src/business` et `src/data` hérités du TP1 : plus aucune route ne les utilise.

À la fin de la partie A, les 4 routes répondent comme le legacy, avec la persistance en mémoire, et il ne reste plus de code du TP1.

### Partie B — Changer d'adapter : le fichier JSON

7. Écrivez `JsonScreeningRepository` et `JsonBookingRepository` (en vous appuyant sur `JsonFile` fourni) : ils font le **mapping** entre le format du fichier et les objets du domaine.
8. Faites passer la **suite de contrat fournie** sur **les deux** adapters. Lisez-la d'abord : elle décrit précisément ce que « respecter le port » veut dire.
9. Réorganisez la composition root dans `src/container.ts` : `buildApp(adapters)` construit l'application à partir d'un jeu d'adapters, et une autre fonction choisit les adapters selon la configuration (`--json` en argument ou variable d'environnement). `src/main.ts` ne fait plus que démarrer le serveur. Ajoutez le script `"start:json": "tsx src/main.ts --json"` dans `package.json`.
10. Faites passer le **test HTTP fourni**.
11. Vérifiez à la main que `npm run start:json` lit et écrit bien `data/db.json` (relancez `npm run seed` pour repartir de zéro).

## Points de vigilance

- **Aucune modification** dans `domain/` ni dans `application/` pour passer de la mémoire au JSON : si vous devez y toucher, c'est qu'un détail technique a fui dans un port.
- Le mapping (ISO ↔ `Date`, `price` ↔ `unitPrice`) appartient à l'**adapter**, pas au domaine.
- Les tests de contrat doivent être **identiques** pour les deux adapters : c'est le principe de substitution de Liskov à l'échelle de l'architecture.
- Attention aux tests qui écrivent dans le vrai `data/db.json`.

## Critères de réussite

- [ ] 4 use cases, chacun derrière son port entrant
- [ ] Les 4 routes se comportent comme le legacy (statuts et corps de réponse)
- [ ] `npm start` et `npm run start:json` fonctionnent, le cœur est identique dans les deux cas
- [ ] La suite de contrat passe sur l'adapter mémoire **et** sur l'adapter JSON
- [ ] La limite des 2h est testée de façon déterministe
- [ ] Le test HTTP fourni passe
- [ ] Le test d'architecture du TP2 passe toujours
- [ ] `npm test` et `npm run typecheck` passent

## Rendu

En binôme, dans votre dépôt CinéResa : **le même dépôt du TP1 au TP5** (lien déposé une seule fois sur Moodle).
