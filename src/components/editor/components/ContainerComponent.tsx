import { CiTextAlignCenter } from "react-icons/ci";
import IEditorComponent from "../classes/IEditorComponent";
import FloatingAddCompComponent from "../FloatingAddCompComponent";
import { GoContainer } from "react-icons/go";

export default class ContainerComponent extends IEditorComponent {
  constructor() {
    super(
      "Container",
      "Container component that allows you to arrange child components in a flexible layout.",
      "container",
      GoContainer,
      [
        {
          id: "align",
          name: "Align",
          type: "SELECT",
          options: [
            { id: "stretch", name: "Stretch" },
            { id: "center", name: "Center" },
            { id: "start", name: "Start" },
            { id: "end", name: "End" },
          ],
          value: "start",
          visible: true,
        },
        {
          id: "justify",
          name: "Justify",
          type: "SELECT",
          options: [
            { id: "start", name: "Start" },
            { id: "center", name: "Center" },
            { id: "space-between", name: "Space between" },
            { id: "space-around", name: "Space around" },
            { id: "space-evenly", name: "Space evenly" },
          ],
          value: "start",
          visible: true,
        },
        {
          id: "direction",
          name: "Direction",
          type: "SELECT",
          options: [
            { id: "row", name: "Row" },
            { id: "row-reverse", name: "Row reverse" },
            { id: "column", name: "Column" },
            { id: "column-reverse", name: "Column reverse" },
          ],
          value: "row",
          visible: true,
        },
        {
          id: "gap",
          name: "Gap",
          type: "RANGE",
          value: 0,
          visible: true,
        },
        {
          id: "padding",
          name: "Padding",
          type: "RANGE",
          value: 0,
          visible: true,
        },
        {
          id: "backgroundColor",
          name: "Background Color",
          type: "COLOR",
          value: "transparent",
          visible: true,
        },
      ],
    );
  }

  render() {
    const subCompLength = this.subComponents.length;
    const padding = (this.getSetting("padding")?.value || 0) as number;
    return (
      <div className="relative w-full flex flex-col justify-center  items-center">
        <div
          className={`relative w-full flex flex-col max-w-4xl p-4 hover:border hover:border-gray-500`}
          onMouseEnter={() => this.getHoveredComponentMethod()(this)}
          onMouseLeave={() => this.getHoveredComponentMethod()(null)}
        >
          {this.subComponents.map((component) => component.render())}
          {this.getHoveredComponentState() === this && (
            <FloatingAddCompComponent comp={this} position="top_right" />
          )}
        </div>
      </div>
    );
  }

  productionRender(): JSX.Element {
    const subCompLength = this.subComponents.length;
    const padding = (this.getSetting("padding")?.value || 0) as number;
    return (
      <div className="relative w-full flex flex-col justify-center  items-center">
        <div className={`relative w-full flex flex-col max-w-4xl p-4`}>
          {this.subComponents.map((component) => component.productionRender())}
        </div>
      </div>
    );
  }

  clone() {
    return new ContainerComponent();
  }
}
