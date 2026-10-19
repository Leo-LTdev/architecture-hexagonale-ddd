# architecture-hexagonale-ddd

# TP1 — Audit et découpage en couches de CinéResa

## Objectif

Comprendre pourquoi un code « qui marche » peut être difficile à faire évoluer, en auditant l'API legacy **CinéResa**, puis la réorganiser en **trois couches** (présentation / métier / données) **sans changer son comportement**.

## Résultat attendu

- Un fichier `AUDIT.md` à la racine de votre dépôt (cartographie, smells, violations SOLID, graphe de dépendances, bilan).
- Le code réorganisé en couches : `src/presentation`, `src/business`, `src/data`.
- L'API répond exactement comme avant : mêmes routes, mêmes codes HTTP, mêmes corps de réponse.

## Point de départ

Le projet `cineresa-legacy` (dossier `TP/cineresa-legacy`).

Créez **un dépôt Git par binôme** à partir de ce projet : c'est le dépôt du fil rouge, que vous ferez évoluer du TP1 au TP5. Committez le legacy tel quel en premier commit.

```bash
npm install
npm run seed      # (re)génère data/db.json avec des séances dans les prochains jours
npm start         # http://localhost:3000
```

## Fichiers fournis

| Fichier | Rôle |
|---|---|
| `src/server.ts` | toute l'application : routes Express, règles métier, accès au fichier JSON, « envoi » de mails, paiement |
| `scripts/seed.ts` | régénère `data/db.json` |
| `data/db.json` | la « base de données » |

### Routes de l'API

| Méthode | Route | Description |
|---|---|---|
| GET | `/screenings` | séances à venir avec le nombre de places restantes |
| POST | `/screenings/:id/bookings` | réserver — body `{ "email": "...", "seats": 2, "tariff": "NORMAL" \| "STUDENT" }` |
| DELETE | `/bookings/:id` | annuler une réservation |
| GET | `/bookings?email=...` | réservations d'un client |

### Règles métier

- 1 à 6 places par réservation, dans la limite de la capacité de la salle
- impossible de réserver une séance déjà commencée
- tarif étudiant -30 %, remise groupe -10 % dès 4 places (prix en centimes)
- annulation possible jusqu'à 2h avant la séance
- un e-mail de confirmation / d'annulation est envoyé (simulé par `console.log`)

## Consignes

Le TP se fait en deux parties : la **partie A** juste après le cours sur les couches, la **partie B** après le cours sur SOLID et la testabilité.

### Partie A — Audit et découpage en couches

**Prise en main**

1. Lisez `src/server.ts` en entier et testez chaque route (curl, Postman, Bruno ou l'extension REST Client).

**Audit**

2. Dans `AUDIT.md`, faites un tableau qui associe **chaque bloc de code** (numéros de lignes) à sa **responsabilité** : présentation (HTTP), règle métier, accès aux données, infrastructure (mail, paiement, temps).
3. Listez au moins **6 code smells** (nom du smell, lignes concernées, conséquence concrète).

**Découpage en couches**

4. Créez `src/data` : un accès au fichier JSON, un `ScreeningRepository`, un `BookingRepository`, ainsi que le mailer et le paiement.
5. Créez `src/business` : un `BookingService` (réserver, annuler, lister mes réservations) et un `ScreeningService` (lister les séances). **Toutes** les règles métier y sont, et **aucune** notion HTTP (`req`, `res`, codes de statut).
6. Créez `src/presentation` : les routes Express, qui se contentent de lire la requête, appeler le service, formater la réponse. Les erreurs métier sont traduites en codes HTTP à **un seul** endroit.
7. Vérifiez que les 4 routes répondent exactement comme le legacy.

### Partie B — SOLID, dépendances et tests

**SOLID**

8. Dans `AUDIT.md`, pour **chaque lettre de SOLID**, indiquez une violation présente dans le code legacy (ou expliquez pourquoi la lettre ne s'applique pas ici).
9. Supprimez la duplication du calcul des places restantes et remplacez les nombres magiques par des constantes nommées.

**Dépendances**

10. Dessinez le graphe des dépendances de la route `POST /screenings/:id/bookings` : tout ce dont elle dépend, y compris **le temps** (`new Date()`), **le hasard** (`Math.random()`), **le disque** (`fs`) et **la console**. Format libre (Mermaid conseillé, intégré dans `AUDIT.md`).
11. Pour chaque dépendance, répondez : « peut-on la remplacer dans un test sans modifier le code ? ».

**Tests**

12. Isolez le calcul du prix dans une fonction pure et écrivez ses tests unitaires avec **Vitest** (`npm test`).

**Bilan**

13. Dans `AUDIT.md`, répondez : quelles règles métier pouvez-vous maintenant tester **sans** démarrer le serveur ni écrire dans `data/db.json` ? Lesquelles restent impossibles à tester ? Pourquoi ?

## Points de vigilance

- **Ne changez pas le comportement** : même si une règle vous semble bizarre, elle doit rester identique. Comparez les réponses avant / après.
- Une couche ne dépend que de **la couche du dessous** : `presentation → business → data`. Jamais l'inverse.
- `BookingService` qui fait `new BookingRepository()` est **normal** dans ce TP : c'est justement la limite des couches que l'on corrigera au TP2.
- Faites des commits petits et fréquents (un par étape).

## Critères de réussite

- [ ] `AUDIT.md` contient la cartographie, au moins 6 smells, les 5 lettres SOLID et le graphe de dépendances
- [ ] Les trois dossiers `presentation`, `business`, `data` existent et respectent le sens des dépendances
- [ ] Aucun `req`, `res` ni code HTTP dans `business`
- [ ] Le calcul des places restantes n'existe qu'à un seul endroit
- [ ] Les tests du calcul de prix passent (`npm test`) et `npm run typecheck` ne remonte aucune erreur
- [ ] Les 4 routes répondent comme le legacy
- [ ] Le bilan explique ce qui reste intestable et pourquoi

## Rendu

En binôme, dans votre dépôt CinéResa : **le même dépôt du TP1 au TP5** (lien déposé une seule fois sur Moodle).