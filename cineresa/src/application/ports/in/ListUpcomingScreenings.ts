import { ScreeningView } from "@application/dto/ScreeningView";

export interface ListUpcomingScreenings {
  execute(): Promise<ScreeningView[]>;
}
