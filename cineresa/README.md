# CinéResa

API de réservation de places de cinéma, refactorée d'un code legacy monolithique vers une **architecture hexagonale** et un modèle **DDD tactique**. Projet du module DDD — Ynov B3.

## Membres du projet 

| Membre | GitHub |
| --- | --- |
| Léo | [@Leo-LTdev](https://github.com/Leo-LTdev) |
| Corentin H. | [@corentin-cpp](https://github.com/corentin-cpp) |

## Démarrage

```bash
npm install
npm run seed         # (re)génère data/db.json
npm start            # persistance en mémoire — http://localhost:3000
npm run start:json   # persistance dans data/db.json
npm test             # tests unitaires, contrat, HTTP, architecture
npm run typecheck
```

## Arborescence

```
src/
├── domain/
│   ├── shared/      DomainError, DomainEvent, Money, Email
│   └── booking/     Screening (racine), Booking, SeatCount, Tariff, PricingPolicy, events
├── application/
│   ├── ports/in/    BookSeats, CancelBooking, ListUpcomingScreenings, ListMyBookings
│   ├── ports/out/   ScreeningRepository, PaymentGateway, EventPublisher, Notifier, Clock, IdGenerator
│   ├── usecases/    un service par port entrant
│   ├── handlers/    NotifyCustomer (e-mails en réaction aux événements)
│   └── dto/         commande et vues renvoyées (les objets du domaine ne sortent pas)
├── adapters/
│   ├── in/http/     routes Express + traduction DomainError -> statut HTTP
│   └── out/         persistence (mémoire, JSON), payment, events, notification, system
├── container.ts     composition root : buildApp(adapters), adaptersFromConfig()
└── main.ts          démarre le serveur
test/                tests Vitest (aucun ne démarre de serveur réel ni n'écrit dans data/db.json)
docs/                DAT, diagrammes PlantUML, ADR
```

## Documentation

- [Document d'architecture technique](docs/DAT.md)
- [ADR-001 — Booking dans l'agrégat Screening](docs/001-booking-dans-agregat-screening.md)
