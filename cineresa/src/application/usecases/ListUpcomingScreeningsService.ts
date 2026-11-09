import { ScreeningView, toScreeningView } from "@application/dto/ScreeningView";
import { ListUpcomingScreenings } from "@application/ports/in/ListUpcomingScreenings";
import { Clock } from "@application/ports/out/Clock";
import { ScreeningRepository } from "@application/ports/out/ScreeningRepository";

export class ListUpcomingScreeningsService implements ListUpcomingScreenings {
  constructor(
    private readonly screenings: ScreeningRepository,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<ScreeningView[]> {
    const screenings = await this.screenings.findStartingAfter(this.clock.now());
    return screenings.map(toScreeningView);
  }
}
