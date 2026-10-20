import { ScreeningRepositoryInterface, JsonDatabaseInterface } from '../../interfaces/Interfaces';
import { Screening } from '../../models/types/types';
class ScreeningRepository implements ScreeningRepositoryInterface {
    private jsonDatabase: JsonDatabaseInterface
    public constructor(jsonDatabase: JsonDatabaseInterface){
        this.jsonDatabase = jsonDatabase;
    }

    public ReadDb(): Screening[] {
        const data = this.jsonDatabase.readDb();
        const result = data.screenings.map((s: any) => Screening.fromJSON(JSON.stringify(s)));
        return result;
    }

    public WriteDb(data: Screening[]): void{
        const db = this.jsonDatabase.readDb();
        db.screenings = data;
        this.jsonDatabase.writeDb(db);
    }
}

export default ScreeningRepository;
