# AUDIT LEGACY

| Code blocs | Rules | Data Access | Infra |
| --- | --- | --- | --- |
| lignes 7 - 9 | Intialisation de l’app avec express | Aucun | Serveur web |
| lignes 12 - 14 | Lecture de la base de donnée JSON | Lecture du fichier .json |  |
| lignes 16 - 18 | Ecriture dans la base de donnée | Ecriture du fichier json |  |
| lignes  23- 43 | Routes /scrennings ⇒ Lecture de la base de donnée qui retourne tout les films à venir ; 
Retour DB | Lecture de la base de donnée |  |
| lignes 49 - 107 | Routes /screenings/:id/bookings ⇒ Réserve des places ; Logique métier dans la DB  ; Retour DB ; Retour HTML  | Insère un champs dans la base de donnée |  |
| lignes 112 - 130 | Routes /bookings/:id ⇒ Annule un resa ; Logique métier + retour DB ; Retour logs |  |  |
| lignes 135 - 144 | Routes /bookings ⇒ Retournes mes resa ; Lecture DB ; Retourne Donnée |  |  |
| lignes 146 - 149 | Lancement serveur |  |  |

`seed.ts` ⇒ Init de la base de donnée (création du fichier, création de donnée)

## SMEELS

- Non respect des couches, retour http, logique métier et appel DB dans le même fichier.
- Nom DB écris dans une chaine de caractère dans le code ainsi que son path => Si le nom de la DB ou que le path change aucune donnée sera remonté.
- Pas de try catch sur les ouvertures de fichiers (erreurs, path indisponible, etc.) aucune erreur en remonte car aucune gestion d'erreur
- Les status et types sont écris en brut plusieurs fois, il faut passer par un enums pour avoir le même nom de partout.
- Format de date qui n'est pas normalisé, si un PC est en UTC+2 et l'autres +4 les dates ne seront pas les mêmes, utiliser un format universel tout le temps (input et output).
- La fonction de resa est trop longue et les calculs en brut dedans ne sont pas bon. La vérification des inputs users peuvent-être divisé en une seul vérification dans une autre fonction.

## Erreur SOLID

### Signe responsability principle

- La fonction `/screenings/:id/bookings` gères plusieurs responsabilités

    - Accès au données
    - Validation des entrées
    - Règles métiers
    - Calcul du prix
    - Création de l'entité
    - Notification par email
    - Gestion en en code HTTP

- La fonction `/bookings/:id` gère l'annulation, changement d'état, les emails
- `/screenings` gère le filtrage temporel, calculs de places restantes
- Le système de calcul de place est dupliqué plusieurs fois.

### Open/Closed principle

- Les règles de tarifications ne sont pas fixe dans le code, on peut facilement ajouter un "SENIOR" par exemple, il faudrai appliquer une stratégie de tarification (PricingPolicy polymorphe).
- Les remises de groupes sont figés dans le code
- Impossible de brancher stipe sans passer par le code.
- Pas de modifs sur les handlers

### Liskov Substitutions Principle

Tout est typé en `any` aucun héritage et interface sont utilisés dans le projet legacy

### Interface Segregation principle

Aucune interface, seul DB est un objects entier
Les données renvoyées ne sont pas filtrés, on retourne toutes les informations et exposes toutes les données (`readDb()` par exemple)

### Dependency Inversion Principle

Les dépendances ne passe pas par de l'abstraction (interface), donc c'est mauvais.

### Dépendances test unitaires

Il faut respecter le Dependency Inversion Principle pour le remplacer dans un test sans modifier le code. Les dépendances non-abstraites ont elle mêmes des dépendances, ce qui bloqueras tout le test.