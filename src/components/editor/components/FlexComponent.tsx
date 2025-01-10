import { CiTextAlignCenter } from "react-icons/ci";
import IEditorComponent from "../classes/IEditorComponent";
import FloatingAddCompComponent from "../FloatingAddCompComponent";
import { useEffect, useState } from "react";

export default class FlexComponent extends IEditorComponent {
  width: number = 0;
  height: number = 0;

  constructor() {
    super(
      "Flex",
      "Flexbox v CSS usnadňuje rozložení prvků na stránce, umožňuje je snadno rozmístit do řady nebo sloupce a přizpůsobit velikosti obrazovky.",
      "flex",
      CiTextAlignCenter,
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

    const maxMobileWidth = 768;

    const justify =
      (this.getSetting("justify")?.value as string) || "flex-start";
    const align = (this.getSetting("align")?.value as string) || "flex-start";
    let direction =
      (this.getSetting("direction")?.value as
        | "row"
        | "row-reverse"
        | "column"
        | "column-reverse") || "row";
    if (window.innerWidth < maxMobileWidth) {
      direction = "column";
    }
    const gap = (this.getSetting("gap")?.value as number) || 0;
    const backgroundColor =
      (this.getSetting("backgroundColor")?.value as string) || "transparent";

    return (
      <div
        className={`relative w-full flex  items-center hover:border border-gray-700 hover:p-4`}
        style={{
          justifyContent: justify,
          alignItems: align,
          flexDirection: direction,
          gap: gap,
          padding: `${subCompLength === 0 ? "10px 10px 10px 10px" : `${padding + 5}px ${padding + 5}px ${padding + 5}px ${padding + 5}px`}`,
          backgroundColor,
        }}
        onMouseEnter={() => this.getHoveredComponentMethod()(this)}
        onMouseLeave={() => this.getHoveredComponentMethod()(null)}
        onResize={(e: any) => {
          this.width = e.target.offsetWidth;
          this.height = e.target.offsetHeight;
        }}
      >
        {this.getHoveredComponentState() === this && (
          <FloatingAddCompComponent comp={this} position="top_left" />
        )}
        {this.subComponents.map((component) => component.render())}
      </div>
    );
  }

  productionRender(): JSX.Element {
    return <Flex component={this} />;
  }

  clone() {
    return new FlexComponent();
  }
}

const Flex = ({ component }: { component: FlexComponent }) => {
  const [width, setWidth] = useState<number>(0);
  const subCompLength = component.subComponents.length;
  const padding = (component.getSetting("padding")?.value || 0) as number;

  const maxMobileWidth = 768;

  const justify =
    (component.getSetting("justify")?.value as string) || "flex-start";
  const align =
    (component.getSetting("align")?.value as string) || "flex-start";
  let direction =
    (component.getSetting("direction")?.value as
      | "row"
      | "row-reverse"
      | "column"
      | "column-reverse") || "row";
  if (window.innerWidth < maxMobileWidth) {
    direction = "column";
  }
  const gap = (component.getSetting("gap")?.value as number) || 0;
  const backgroundColor =
    (component.getSetting("backgroundColor")?.value as string) || "transparent";

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return (
    <div
      className={`relative w-full flex  items-center`}
      style={{
        justifyContent: justify,
        alignItems: align,
        flexDirection: direction,
        gap: gap,
        padding: `${subCompLength === 0 ? "10px 10px 10px 10px" : `${padding + 5}px ${padding + 5}px ${padding + 5}px ${padding + 5}px`}`,
        backgroundColor,
      }}
    >
      {component.subComponents.map((component) => component.productionRender())}
    </div>
  );
};
