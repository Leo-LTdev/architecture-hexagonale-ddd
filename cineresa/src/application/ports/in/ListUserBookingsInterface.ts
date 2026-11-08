import BookingDetailsView from "../../dto/BookingDetailsView";

interface ListUserBookingsInterface {
  execute(email: string): BookingDetailsView[];
}

export default ListUserBookingsInterface;
