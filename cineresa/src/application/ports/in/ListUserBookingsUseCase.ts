import BookingDetailsView from "../../dto/BookingDetailsView";

interface ListUserBookingsUseCase {
  execute(email: string): BookingDetailsView[];
}

export default ListUserBookingsUseCase;
