import IdGenerator from "../../application/ports/out/IdGenerator";

class TimestampIdGenerator implements IdGenerator {
  public generate(): string {
    return "b" + Date.now();
  }
}

export default TimestampIdGenerator;
