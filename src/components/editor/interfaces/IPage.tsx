import IComponent from "./IComponent";
import ISetting from "./ISetting";

export default interface IPage {
  name: string;
  url?: string;
  components: {
    id: string;
    settings: ISetting[];
    subComponents: IComponent[];
  };
}
