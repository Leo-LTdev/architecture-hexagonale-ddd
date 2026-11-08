import { Screening } from "../../../domain/models/types/types";

interface ScreeningRepositoryInterface {
  ReadDb(): Screening[];

  WriteDb(data: Screening[]): void;
}

export default ScreeningRepositoryInterface;
