import { DomainError } from "@domain/shared/DomainError";

export class SeatCount {
  static readonly MIN = 1;
  static readonly MAX = 6;
  static readonly GROUP_THRESHOLD = 4;

  public readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < SeatCount.MIN || value > SeatCount.MAX) {
      throw new DomainError("INVALID", `Entre ${SeatCount.MIN} et ${SeatCount.MAX} places par réservation`);
    }
    this.value = value;
    Object.freeze(this);
  }

  isGroup(): boolean {
    return this.value >= SeatCount.GROUP_THRESHOLD;
  }
}
