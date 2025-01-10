import { CiImageOn, CiVideoOn } from "react-icons/ci";
import IEditorComponent from "../classes/IEditorComponent";
import Image from "next/image";

export default class VideoElement extends IEditorComponent {
  constructor() {
    super("Video", "an video element", "video", CiVideoOn, [
      {
        id: "video",
        name: "Select Video",
        type: "VIDEO",
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
      <video
        src={(this.getSetting("video")?.value as string) || ""}
        width={(this.getSetting("width")?.value as number) || 600}
        height={(this.getSetting("height")?.value as number) || 400}
        crossOrigin="anonymous"
        className={`hover:border border-gray-700 object-cover ${this.getSetting("rounded")?.value ? "rounded-lg" : ""}`}
        onMouseEnter={() => this.getHoveredComponentMethod()(this)}
        onMouseLeave={() => this.getHoveredComponentMethod()(null)}
        onClick={(e) => {
          this.getSelectedComponentMethod()(this);
        }}
        style={{
          width: (this.getSetting("width")?.value as number) || 600,
          height: (this.getSetting("height")?.value as number) || 400,
        }}
        controls
      />
    );
  }

  productionRender(): JSX.Element {
    return (
      <video
        src={(this.getSetting("video")?.value as string) || ""}
        width={(this.getSetting("width")?.value as number) || 600}
        height={(this.getSetting("height")?.value as number) || 400}
        crossOrigin="anonymous"
        className={`object-cover ${this.getSetting("rounded")?.value ? "rounded-lg" : ""}`}
        style={{
          width: (this.getSetting("width")?.value as number) || 600,
          height: (this.getSetting("height")?.value as number) || 400,
        }}
        controls
      />
    );
  }

  clone() {
    return new VideoElement();
  }
}
