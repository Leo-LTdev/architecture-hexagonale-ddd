import { Screening, ScreeningPrimitives } from "@domain/models/Entity/Screening";
import ScreeningRepositoryPort from "@application/ports/out/ScreeningRepositoryInterface";
import JsonDatabaseInterface from "@application/ports/in/JsonDatabaseInterface";

// Traduit JSON <-> Entity Screening.
class ScreeningRepository implements ScreeningRepositoryPort {
    public constructor(private readonly jsonDatabase: JsonDatabaseInterface) {}

    public ReadDb(): Screening[] {
        const data = this.jsonDatabase.readDb();
        return data.screenings.map((s: ScreeningPrimitives) => Screening.restore(s));
    }

    public WriteDb(data: Screening[]): void {
        const db = this.jsonDatabase.readDb();
        db.screenings = data.map((s) => s.toJSON());
        this.jsonDatabase.writeDb(db);
    }
}

export default ScreeningRepository;
