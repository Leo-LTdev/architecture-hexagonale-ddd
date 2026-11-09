/*
{ "screeningId": "s1", "email": "a@b.fr", "seats": 2, "tariff": "NORMAL" }
*/

// Données brutes reçues de l'extérieur : validées par les VOs dans le use case.
class BookSeatsCommand {
    public screeningId: string;
    public email: string;
    public seats: number;
    public tariff?: string;

    public constructor(screeningId: string, email: string, seats: number, tariff?: string) {
        this.screeningId = screeningId;
        this.email = email;
        this.seats = seats;
        this.tariff = tariff;
    }
}

export default BookSeatsCommand;
