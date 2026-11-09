import { Screening } from "@domain/models/Entity/Screening";

interface ScreeningRepositoryInterface {
  ReadDb(): Screening[];

  WriteDb(data: Screening[]): void;
}

export default ScreeningRepositoryInterface;
