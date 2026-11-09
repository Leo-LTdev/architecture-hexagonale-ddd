import { Booking } from "@domain/booking/Booking";

export interface BookingView {
  id: string;
  screeningId: string;
  email: string;
  seats: number;
  tariff: string;
  total: number;
  status: string;
  createdAt: string;
  cancelledAt?: string;
}

export function toBookingView(booking: Booking): BookingView {
  return {
    id: booking.id,
    screeningId: booking.screeningId,
    email: booking.email.value,
    seats: booking.seats.value,
    tariff: booking.tariff,
    total: booking.total.cents,
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
    ...(booking.cancelledAt && { cancelledAt: booking.cancelledAt.toISOString() }),
  };
}
