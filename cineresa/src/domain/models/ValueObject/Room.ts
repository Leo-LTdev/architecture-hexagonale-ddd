import ValidationError from "../../errors/ValidationError";
import { ErrorStatusEnum } from "../Enums/ErrorStatusEnum";

export class Room{
    static readonly MIN_ROOMS = 1;
    static readonly MAX_ROOMS = 20;
    private constructor(
        public readonly number: number,
        public readonly stage: number,
        public readonly type: string
    ){}

    static create(props: {number: number, stage: number, type: string}): Room{
        if(props.number > this.MAX_ROOMS || props.number < this.MIN_ROOMS){
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new Room(props.number, props.stage, props.type)
    }

    toString(): string{
        return ''.concat(this.stage.toString(), this.number.toString(), " ", this.type)
    }
}