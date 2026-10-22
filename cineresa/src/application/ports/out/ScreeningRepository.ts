import { Screening } from "../../../domain/models/types/types";

interface ScreeningRepository {
  ReadDb(): Screening[];

  WriteDb(data: Screening[]): void;
}

export default ScreeningRepository;
