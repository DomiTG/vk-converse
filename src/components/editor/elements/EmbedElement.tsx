import { CiGlobe } from "react-icons/ci";
import IEditorComponent from "../classes/IEditorComponent";
import FloatingAddCompComponent from "../FloatingAddCompComponent";

export default class EmbedElement extends IEditorComponent {
  constructor() {
    super("Embed", "an embed element", "embed", CiGlobe, [
      {
        id: "url",
        name: "Embed URL",
        type: "TEXT",
        value: "",
        visible: true,
      },
      {
        id: "width",
        name: "Width",
        type: "NUMBER",
        value: 600,
        visible: true,
      },
      {
        id: "height",
        name: "Height",
        type: "NUMBER",
        value: 400,
        visible: true,
      },
      {
        id: "rounded",
        name: "Rounded",
        type: "BOOLEAN",
        value: false,
        visible: true,
      },
    ]);
  }

  render() {
    const url = this.getSetting("url")?.value as string;
    const width = (this.getSetting("width")?.value as number) || 600;
    const height = (this.getSetting("height")?.value as number) || 400;
    const rounded = this.getSetting("rounded")?.value as boolean;

    return (
      <div
        className={`relative group hover:border border-gray-700 ${
          rounded ? "rounded-lg" : ""
        }`}
        style={{
          width,
          height,
        }}
        onMouseEnter={() => {
          this.getHoveredComponentMethod()(this);
        }}
        onMouseLeave={() => {
          this.getHoveredComponentMethod()(null);
        }}
        onClick={(e) => {
          e.preventDefault(); // Prevent event bubbling
          this.getSelectedComponentMethod()(this);
        }}
      >
        {this.getHoveredComponentState() === this && (
          <FloatingAddCompComponent comp={this} position="top_right" />
        )}
        <iframe
          src={url || ""}
          width="100%"
          height="100%"
          className={`absolute top-0 left-0 w-full h-full ${
            rounded ? "rounded-lg" : ""
          }`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  productionRender(): JSX.Element {
    const url = this.getSetting("url")?.value as string;
    const width = (this.getSetting("width")?.value as number) || 600;
    const height = (this.getSetting("height")?.value as number) || 400;
    const rounded = this.getSetting("rounded")?.value as boolean;

    return (
      <div
        className={`relative ${
          rounded ? "rounded-lg" : ""
        }`}
        style={{
          width,
          height,
        }}
      >
        <iframe
          src={url || ""}
          width="100%"
          height="100%"
          className={`absolute top-0 left-0 w-full h-full ${
            rounded ? "rounded-lg" : ""
          }`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  clone() {
    return new EmbedElement();
  }
}
