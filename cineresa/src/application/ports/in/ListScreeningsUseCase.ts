import ScreeningView from "../../dto/ScreeningView";

interface ListScreeningsUseCase {
  execute(): ScreeningView[];
}

export default ListScreeningsUseCase;
