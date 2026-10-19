/*
{ "email": "a@b.fr", "seats": 2, "tariff": "NORMAL" }
*/

import TarifPolicy from "../TarifPolicy";

class BookingDto{
    public email: string;
    public seats: number;
    public tariff: TarifPolicy;

    public constructor(email:string, seats: number, tariff: TarifPolicy){
        this.email = email;
        this.seats = seats;
        this.tariff = tariff;
    }

    public toJson(): string{
        return JSON.stringify({
                email: this.email,
                seats: this.seats,
                tariff: this.tariff
            })
    }

    public static fromJson(json: string){
        const data = JSON.parse(json);
        return new BookingDto(
            data.email,
            data.seats,
            data.tariff
        )
    }
}

export default BookingDto;