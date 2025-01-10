import { FaSpaceShuttle } from "react-icons/fa";
import IEditorComponent from "../classes/IEditorComponent";

export default class MarginElement extends IEditorComponent {
  constructor() {
    super(
      "Odsazení",
      "Potřebujete odsadit nějaký element? Použijte tento element.",
      "margin",
      FaSpaceShuttle,
      [
        {
          id: "MARGIN_TOP",
          name: "Odsazení shora",
          type: "NUMBER",
          value: 5,
          visible: true,
        },
        {
          id: "MARGIN_BOTTOM",
          name: "Odsazení zdola",
          type: "NUMBER",
          value: 5,
          visible: true,
        },
      ],
    );
  }

  render() {
    const marginTop = this.getSetting("MARGIN_TOP")?.value || 0;
    const marginBottom = this.getSetting("MARGIN_BOTTOM")?.value || 0;

    return (
      <div
        style={{
          paddingTop: `${marginTop}px`,
          paddingBottom: `${marginBottom}px`,
        }}
        onClick={() => this.getSelectedComponentMethod()(this)}
        className="hover:border border-dashed border-gray-300 w-full cursor-pointer"
      />
    );
  }

  productionRender(): JSX.Element {
    const marginTop = this.getSetting("MARGIN_TOP")?.value || 0;
    const marginBottom = this.getSetting("MARGIN_BOTTOM")?.value || 0;

    return (
      <div
        style={{
          marginTop: `${marginTop}px`,
          marginBottom: `${marginBottom}px`,
        }}
      />
    );
  }

  clone() {
    return new MarginElement();
  }
}
