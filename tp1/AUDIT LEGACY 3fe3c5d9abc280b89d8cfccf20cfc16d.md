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