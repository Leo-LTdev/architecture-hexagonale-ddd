import IdGenerator from "../../application/ports/out/IdGeneratorInterface";

class TimestampIdGenerator implements IdGenerator {
  public generate(): string {
    return "b" + Date.now();
  }
}

export default TimestampIdGenerator;
