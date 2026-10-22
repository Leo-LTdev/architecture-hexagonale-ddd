import Clock from "../../application/ports/out/Clock";

class SystemClock implements Clock {
  public now(): Date {
    return new Date();
  }
}

export default SystemClock;
