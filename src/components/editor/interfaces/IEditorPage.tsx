import IEditorComponent from "../classes/IEditorComponent";

export default interface IEditorPage {
  name: string;
  url: string;
  page_type: "BASKET" | "CONVERSE_PAGE" | "UNKNOWN";
  root_component: IEditorComponent | null;
}
