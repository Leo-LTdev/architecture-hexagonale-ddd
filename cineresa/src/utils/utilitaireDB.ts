import fs from "fs";
import path from "path";

class configuration {
    private readonly DB_FILE = path.join(__dirname, "..", "src", "data", "db.json");

    public readDb(): any {
        return JSON.parse(fs.readFileSync(this.DB_FILE, "utf-8"));
    }   

    public writeDb(db: any) {
        fs.writeFileSync(this.DB_FILE, JSON.stringify(db, null, 2));
    }
}

export default configuration