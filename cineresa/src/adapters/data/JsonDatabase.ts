import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { JsonDatabaseInterface } from "../../interfaces/Interfaces";

dotenv.config();

class JsonDatabase implements JsonDatabaseInterface {
    private readonly DB_FILE= path.join(process.env.DB_FILE ?? "/db.json");

    public readDb(): any {
        console.log(this.DB_FILE)
        return JSON.parse(fs.readFileSync(this.DB_FILE, "utf-8"));
    }

    public writeDb(db: any) {
        fs.writeFileSync(this.DB_FILE, JSON.stringify(db, null, 2)); 
    }

}

export default JsonDatabase