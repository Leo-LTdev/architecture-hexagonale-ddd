import { BookingDetailsView } from "@application/dto/BookingDetailsView";

export interface ListMyBookings {
  execute(email: string): Promise<BookingDetailsView[]>;
}
