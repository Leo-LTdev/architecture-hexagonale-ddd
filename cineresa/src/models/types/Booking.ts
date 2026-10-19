/*
      id: "b" + Date.now(),
      screeningId: s.id,
      email: email,
      seats: seats,
      tariff: data.body.tariff === "STUDENT" ? "STUDENT" : "NORMAL",
      total: total,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),

*/

import TarifPolicy from "../TarifPolicy";
import BookingStatus from "../BookingStatus";

class Booking {
    public id: string;
    public screeningId: string;
    public email:string;
    public seats: number;
    public tariff: TarifPolicy;
    public total: number;
    public status: BookingStatus;
    public createdAt: string;
    public updatedAt?: string;
    public cancelledAt?: string;

    public constructor(
        id: string,
        screeningId: string,
        email: string,
        seats: number,
        tariff: TarifPolicy,
        total: number,
        status: BookingStatus,
        createdAt: string,
        updatedAt?: string,
        cancelledAt?: string
    ) {
        this.id = id;
        this.screeningId = screeningId;
        this.email = email;
        this.seats = seats;
        this.tariff = tariff;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.cancelledAt = cancelledAt;
    }

    public toJSON(): object{
        return {
            id: this.id,
            screeningId: this.screeningId,
            email: this.email,
            seats: this.seats,
            tariff: this.tariff,
            total: this.total,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            cancelledAt: this.cancelledAt
        };
    }

    public static fromJSON(json: string): Booking{
        const data = JSON.parse(json);
        return new Booking(
            data.id,
            data.screeningId,
            data.email,
            data.seats,
            data.tariff,
            data.total,
            data.status,
            data.createdAt,
            data.updatedAt,
            data.cancelledAt
        );
    }
}

export default Booking;