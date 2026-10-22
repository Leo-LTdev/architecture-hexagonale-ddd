/*
{ "screeningId": "s1", "email": "a@b.fr", "seats": 2, "tariff": "NORMAL" }
*/

import { TarifPolicy } from "../../domain/models/types/types";

class BookSeatsCommand {
    public screeningId: string;
    public email: string;
    public seats: number;
    public tariff: TarifPolicy;

    public constructor(screeningId: string, email: string, seats: number, tariff: TarifPolicy) {
        this.screeningId = screeningId;
        this.email = email;
        this.seats = seats;
        this.tariff = tariff;
    }
}

export default BookSeatsCommand;
