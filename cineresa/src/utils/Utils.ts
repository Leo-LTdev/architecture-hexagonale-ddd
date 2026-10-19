import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

class Utils {
    private readonly DB_FILE= path.join(process.env.DB_FILE ?? "./src/data/db.json");

    public readDb(): any {
        return JSON.parse(fs.readFileSync(this.DB_FILE, "utf-8"));
    }

    public writeDb(db: any) {
        fs.writeFileSync(this.DB_FILE, JSON.stringify(db, null, 2)); 
    }

}

export default Utils