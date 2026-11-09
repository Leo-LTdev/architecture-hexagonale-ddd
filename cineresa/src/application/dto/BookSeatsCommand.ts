// Données brutes venues de l'extérieur : elles sont validées par les value objects dans le use case.
export type BookSeatsCommand = {
  screeningId: string;
  email: unknown;
  seats: unknown;
  tariff?: unknown;
};
