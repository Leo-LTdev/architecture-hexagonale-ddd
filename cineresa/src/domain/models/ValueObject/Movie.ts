import ValidationError from "../../errors/ValidationError"
import { ErrorStatusEnum } from "../Enums/ErrorStatusEnum"

export class Movie {
  private constructor(public readonly name: string) {}

  static create(name: string) : Movie{
    const value = name?.trim().toLocaleUpperCase()
    if(value.length > 15){
        throw new ValidationError(ErrorStatusEnum.INVALID)
    }

    return new Movie(value);
  }

  equals(other: Movie): boolean{
    return this.name == other.name;
  }

  toString(): string{
    return this.name;
  }
}
