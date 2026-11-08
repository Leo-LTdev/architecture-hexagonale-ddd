interface JsonDatabaseInterface {
  readDb(): any;

  writeDb(db: any): void;
}

export default JsonDatabaseInterface;
