import { CiImageOn } from "react-icons/ci";
import IEditorComponent from "../classes/IEditorComponent";
import Image from "next/image";

export default class ImageElement extends IEditorComponent {
  constructor() {
    super("Image", "an image element", "image", CiImageOn, [
      {
        id: "image",
        name: "Select Image",
        type: "IMAGE",
        value: null,
        visible: true,
      },
      {
        id: "alt",
        name: "Alt Text",
        type: "TEXT",
        value: "Image",
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
    return (
      <Image
        src={(this.getSetting("image")?.value as string) || ""}
        width={(this.getSetting("width")?.value as number) || 600}
        height={(this.getSetting("height")?.value as number) || 400}
        crossOrigin="anonymous"
        alt={(this.getSetting("alt")?.value as string) || "Image"}
        className={`hover:border border-gray-700 object-cover ${
          this.getSetting("rounded")?.value ? "rounded-lg" : ""
        }`}
        onMouseEnter={() => this.getHoveredComponentMethod()(this)}
        onMouseLeave={() => this.getHoveredComponentMethod()(null)}
        onClick={(e) => {
          e.preventDefault();
          this.getSelectedComponentMethod()(this);
        }}
        style={{
          width: (this.getSetting("width")?.value as number) || 600,
          height: (this.getSetting("height")?.value as number) || 400,
        }}
      />
    );
  }

  productionRender(): JSX.Element {
    return (
      <Image
        src={(this.getSetting("image")?.value as string) || ""}
        width={(this.getSetting("width")?.value as number) || 600}
        height={(this.getSetting("height")?.value as number) || 400}
        crossOrigin="anonymous"
        alt={(this.getSetting("alt")?.value as string) || "Image"}
        className={`object-cover ${
          this.getSetting("rounded")?.value ? "rounded-lg" : ""
        }`}
        style={{
          width: (this.getSetting("width")?.value as number) || 600,
          height: (this.getSetting("height")?.value as number) || 400,
          objectFit: "cover",
        }}
      />
    );
  }

  clone() {
    return new ImageElement();
  }
}
