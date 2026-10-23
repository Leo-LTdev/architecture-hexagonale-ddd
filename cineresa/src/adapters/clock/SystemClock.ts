import Clock from "../../application/ports/out/ClockInterface";

class SystemClock implements Clock {
  public now(): Date {
    return new Date();
  }
}

export default SystemClock;
