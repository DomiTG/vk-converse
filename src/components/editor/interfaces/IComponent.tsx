import ISetting from "./ISetting";

export default interface IComponent {
  id: string;
  settings: ISetting[];
  subComponents: IComponent[];
}
