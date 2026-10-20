import { Screening } from "../../models/types/types";

interface BookingRepositoryInterface {
    ReadDb(): Screening[]

    WriteDb(data: Screening[]): void
}

export default BookingRepositoryInterface;
