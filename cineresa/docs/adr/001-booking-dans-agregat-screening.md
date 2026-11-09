# ADR-001 : Booking dans l'agrégat Screening ou agrégat séparé ?

Statut : accepté — 09/11/2026

## Contexte

Une séance a un nombre de places limité, et on ne doit jamais vendre plus de places qu'il y en a.

Au début, on avait un repository pour les séances et un pour les réservations. C'était le use case qui comptait les places. Du coup, rien n'empêchait d'enregistrer une réservation sans faire ce calcul.

## Options envisagées

1. Mettre `Booking` dans l'agrégat `Screening`. La séance contient ses réservations, et on n'a plus qu'un seul repository.
2. Garder `Booking` à part, avec son propre repository. Le use case vérifie les places avant d'enregistrer.

## Décision

On prend l'option 1. Pour réserver, on passe forcément par `Screening.book()`, qui vérifie les places restantes. On ne peut donc plus oublier la règle.

## Conséquences

+ La règle des places est au même endroit, dans `Screening`.
+ On peut la tester sans repository ni serveur (`test/Screening.test.ts`).
+ Il n'y a plus qu'un seul repository à écrire.
- Pour réserver, on charge la séance avec toutes ses réservations.
- Pour retrouver une réservation par son id ou par email, on parcourt les séances.
- Le JSON et les tests de contrat du TP3 étaient faits pour `BookingRepository`, donc on a dû les retirer.
