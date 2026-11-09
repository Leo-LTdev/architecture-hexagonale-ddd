import BookingDetailsView from "@application/dto/BookingDetailsView";

interface ListUserBookingsInterface {
  execute(email: string): BookingDetailsView[];
}

export default ListUserBookingsInterface;
