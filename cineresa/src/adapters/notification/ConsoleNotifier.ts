import Notifier from "../../application/ports/out/Notifier";

class ConsoleNotifier implements Notifier {
  public notify(to: string, message: string): void {
    console.log(`[SMTP] To: ${to} — ${message}`);
  }
}

export default ConsoleNotifier;
