import { Screening } from "@domain/booking/Screening";

export interface ScreeningView {
  id: string;
  movie: string;
  room: string;
  startsAt: string;
  price: number;
  remaining: number;
}

export function toScreeningView(screening: Screening): ScreeningView {
  return {
    id: screening.id,
    movie: screening.movie,
    room: screening.room,
    startsAt: screening.startsAt.toISOString(),
    price: screening.unitPrice.cents,
    remaining: screening.remainingSeats(),
  };
}
