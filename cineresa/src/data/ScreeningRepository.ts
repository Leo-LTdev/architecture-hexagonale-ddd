import RepositoryInterface from '../interfaces/RepositoryInterface';
import { Screening } from '../models/types/types';
import Utils from '../utils/Utils';
class ScreeningRepository implements RepositoryInterface {
    private utils: Utils;
    public constructor(utils: Utils){
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
