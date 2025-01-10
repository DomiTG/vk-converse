import IEditorComponent from "../classes/IEditorComponent";
import { FaHtml5 } from "react-icons/fa6";

export default class OwnHTMLElement extends IEditorComponent {
  constructor() {
    super("HTML", "Own HTML", "own_html", FaHtml5, [
      {
        id: "html_code",
        name: "Insert your HTML",
        type: "CODE",
        value: `<p class="text-gray-500">My own HTML code!</p>`,
        visible: true,
      },
    ]);
  }

  render() {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html:
            this.getSetting("html_code")?.value ||
            `<p class="text-gray-500">My own dddd code!</p>`,
        }}
        onClick={() => this.getSelectedComponentMethod()(this)}
      />
    );
  }

  productionRender(): JSX.Element {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html:
            this.getSetting("html_code")?.value ||
            `<p class="text-gray-500">My own HTML code!</p>`,
        }}  
      />
    );
  }

  clone() {
    return new OwnHTMLElement();
  }
}
