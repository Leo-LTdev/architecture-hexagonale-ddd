import { BookingView, toBookingView } from "@application/dto/BookingView";
import { Booking } from "@domain/booking/Booking";
import { Screening } from "@domain/booking/Screening";

export interface BookingDetailsView extends BookingView {
  movie: string;
  startsAt: string;
}

export function toBookingDetailsView(booking: Booking, screening: Screening): BookingDetailsView {
  return {
    ...toBookingView(booking),
    movie: screening.movie,
    startsAt: screening.startsAt.toISOString(),
  };
}
