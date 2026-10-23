import { TariffPolicyEnum, BookingStatusEnum } from "../../utils/enums";

export class BookingType {
    public id: string;
    public screeningId: string;
    public email:string;
    public seats: number;
    public tariff: TariffPolicyEnum;
    public total: number;
    public status: BookingStatusEnum;
    public createdAt: string;
    public updatedAt?: string;
    public cancelledAt?: string;

    public constructor(
        id: string,
        screeningId: string,
        email: string,
        seats: number,
        tariff: TariffPolicyEnum,
        total: number,
        status: BookingStatusEnum,
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

    public static fromJSON(json: string): BookingType{
        const data = JSON.parse(json);
        return new BookingType(
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