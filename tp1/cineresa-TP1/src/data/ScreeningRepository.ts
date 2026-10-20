import { ScreeningRepositoryInterface, UtilsInterface } from '../interfaces/Interfaces';
import { Screening } from '../models/types/types';
class ScreeningRepository implements ScreeningRepositoryInterface {
    private utils: UtilsInterface;
    public constructor(utils: UtilsInterface){
        this.utils = utils;
    }

    public ReadDb(): Screening[] {
        const data = this.utils.readDb();
        const result = data.screenings.map((s: any) => Screening.fromJSON(JSON.stringify(s)));
        return result;
    }

    public WriteDb(data: Screening[]): void{
        const db = this.utils.readDb();
        db.screenings = data;
        this.utils.writeDb(db);
    }
}

export default ScreeningRepository;
