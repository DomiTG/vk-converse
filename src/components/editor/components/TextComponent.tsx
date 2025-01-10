import React from "react";
import IEditorComponent from "../classes/IEditorComponent";
import { CiText } from "react-icons/ci";
import * as FaIcons from "react-icons/fa"; // Font Awesome icons
import { IconType } from "react-icons";
import IconRenderer from "@/components/IconRenderer";
import RootComponent from "./RootComponent";

export default class TextComponent extends IEditorComponent {
  randomId: string = "";

  constructor() {
    super("text", "text", "text", CiText, [
      {
        id: "html_tag",
        name: "HTML Tag",
        type: "SELECT",
        options: [
          { id: "p", name: "Paragraph" },
          { id: "h1", name: "Header 1" },
          { id: "h2", name: "Header 2" },
        ],
        value: "p",
        visible: true,
      },
      {
        id: "text_size",
        name: "Text Size",
        type: "RANGE",
        rangeMin: 0.5,
        rangeMax: 3,
        rangeStep: 0.1,
        value: 0,
        visible: true,
      },
      {
        id: "html_content",
        name: "Text HTML",
        type: "CODE",
        value: "ahoj!",
        visible: false,
      },
      {
        id: "text_align",
        name: "Text Alignation",
        type: "SELECT",
        options: [
          { id: "start", name: "Start" },
          { id: "end", name: "End" },
          { id: "center", name: "Center" },
          { id: "justify", name: "Justify" },
        ],
        value: "start",
        visible: true,
      },
      {
        id: "color",
        name: "Text Color",
        type: "COLOR",
        value: "#000",
        visible: true,
      },
      {
        id: "line_height",
        name: "Line Height",
        type: "RANGE",
        rangeMin: -5,
        rangeMax: 5,
        value: 0,
        visible: true,
      },
      {
        id: "letter_spacing",
        name: "Letter Spacing",
        type: "RANGE",
        value: 0,
        rangeMin: -5,
        rangeMax: 5,
        visible: true,
      },
      {
        id: "font",
        name: "Font",
        type: "SELECT",
        options: [
          { id: "Arial, sans-serif", name: "Arial" },
          { id: "'Helvetica Neue', Helvetica, sans-serif", name: "Helvetica" },
          { id: "'Times New Roman', Times, serif", name: "Times New Roman" },
          { id: "'Georgia', serif", name: "Georgia" },
          { id: "'Courier New', Courier, monospace", name: "Courier New" },
          { id: "'Verdana', sans-serif", name: "Verdana" },
          { id: "'Trebuchet MS', sans-serif", name: "Trebuchet MS" },
          { id: "'Tahoma', sans-serif", name: "Tahoma" },
          { id: "'Impact', sans-serif", name: "Impact" },
          { id: "'Comic Sans MS', sans-serif", name: "Comic Sans MS" },
          { id: "'Lucida Sans', sans-serif", name: "Lucida Sans" },
          { id: "'Palatino Linotype', Palatino, serif", name: "Palatino" },
          { id: "'Garamond', serif", name: "Garamond" },
          { id: "'Segoe UI', Tahoma, Geneva, sans-serif", name: "Segoe UI" },
          { id: "'Roboto', sans-serif", name: "Roboto" },
          { id: "'Open Sans', sans-serif", name: "Open Sans" },
          { id: "'Lato', sans-serif", name: "Lato" },
          { id: "'Oswald', sans-serif", name: "Oswald" },
          { id: "'Montserrat', sans-serif", name: "Montserrat" },
          { id: "'Ubuntu', sans-serif", name: "Ubuntu" },
        ],
        value: "Arial, sans-serif",
        visible: true,
      },
      {
        id: "icon",
        name: "Icon",
        type: "SELECT",
        options: [
          { id: "", name: "None" },
          ...Object.keys(FaIcons).map((iconName) => {
            return {
              id: iconName,
              name: iconName,
            };
          }),
        ],
        value: "",
        visible: true,
      },
      {
        id: "icon_color",
        name: "Icon Color",
        type: "COLOR",
        value: "#000",
        visible: true,
      },
    ]);
    this.randomId =
      Math.floor(Math.random() * 100).toString() + Date.now().toString();
  }

  // Method to generate HTML tag dynamically
  getHtmlTag = (tag: string, props: any = {}): React.ReactNode => {
    switch (tag) {
      case "h1":
        return <h1 {...props} />;
      case "h2":
        return <h2 {...props} />;
      case "h3":
        return <h3 {...props} />;
      case "h4":
        return <h4 {...props} />;
      case "p":
        return <p {...props} />;
      default:
        throw new Error(`Invalid tag: ${tag}`);
    }
  };

  handleSelection = () => {
    const selectedText = window.getSelection()?.toString();
    const toolbar = document.getElementById(this.randomId + "_toolbar");
    const element = document.getElementById(this.randomId);
    if (!element) return;
    if (selectedText && toolbar) {
      toolbar.style.display = "block";
      const range = window.getSelection()?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect && toolbar) {
        toolbar.style.top = `${element.clientTop + element.clientHeight}px`;
        toolbar.style.left = `${element.clientLeft}px`;
      }
    }
  };

  applyStyle = (style: string) => {
    document.execCommand(style);
    const toolbar = document.getElementById(this.randomId + "_toolbar");
    console.log(style);
    if (toolbar) {
      toolbar.style.display = "none";
    }

    // Update the HTML content setting
    const element = document.getElementById(this.randomId);
    const setting = this.getSetting("html_content");
    if (setting && element?.innerHTML) {
      setting.value = element.innerHTML;
    }
  };

  handleOutsideClick = (event: any) => {
    const toolbar = document.getElementById(this.randomId + "_toolbar");
    if (!toolbar) return;

    if (toolbar.contains(event.target)) {
      return;
    }

    toolbar.style.display = "none";
    const element = document.getElementById(this.randomId);
    const setting = this.getSetting("html_content");
    if (setting && element?.innerHTML) {
      setting.value = element.innerHTML;
    }
    this.getUpdateMethod()(this);
  };

  componentDidMount() {
    document.addEventListener("click", this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  }

  render() {
    const tag = (this.getSetting("html_tag")?.value || "p") as string;
    const fontSize = (this.getSetting("text_size")?.value || 1) as number;
    const icon = this.getSetting("icon")?.value || undefined;
    const iconColor = this.getSetting("icon_color")?.value || "#000";
    const htmlContent = (this.getSetting("html_content")?.value ||
      "") as string;
    const textAlign = (this.getSetting("text_align")?.value ||
      "start") as string;
    const textWidth = (this.getSetting("width")?.value || "full") as string;
    const textColor = (this.getSetting("color")?.value || "#000") as string;
    const lineHeight = (this.getSetting("line_height")?.value || 0) as number;
    const letterSpacing = (this.getSetting("letter_spacing")?.value ||
      0) as number;
    const font = this.getSetting("font")?.value || "Arial, sans-serif";

    // Call getHtmlTag to generate the appropriate tag with props
    const tagElement = this.getHtmlTag(tag, {
      contentEditable: true,
      className: `text-gray-800 h-full font-medium hover:border hover:border-zinc-700 p-2 ${
        textWidth === "full" ? "w-full" : "w-auto"
      }`,
      style: {
        //responsive font size
        fontSize: fontSize + "rem",
        textAlign: textAlign,
        color: textColor,
        lineHeight: fontSize + lineHeight + "rem",
        letterSpacing: letterSpacing,
        fontFamily: font,
        height: "100%",
      },
      dangerouslySetInnerHTML: { __html: htmlContent },
      onBlur: (e: any) => {
        e.preventDefault();
        const toolbar = document.getElementById(this.randomId + "_toolbar");
        if (toolbar) {
          setTimeout(() => {
            toolbar.style.display = "none";
            this.getUpdateMethod()(this);
          }, 500);
        }
      },
      onSelect: this.handleSelection,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        this.getSelectedComponentMethod()(this);
      },
      onInput: (e: React.FormEvent) => {
        const element = document.getElementById(this.randomId);
        const setting = this.getSetting("html_content");
        if (setting && element?.innerHTML) {
          setting.value = element.innerHTML;
        }
      },
      id: this.randomId,
    });

    type IconName = keyof typeof FaIcons;

    return (
      <>
        <div className="relative">
          <div className="flex flex-row items-center space-x-2">
            {icon && (
              <IconRenderer
                icon={icon as IconName}
                size={fontSize}
                color={iconColor as string}
              />
            )}
            {tagElement}
          </div>
          <div
            id={this.randomId + "_toolbar"}
            className="absolute bg-gray-700 text-white p-2 rounded-md shadow-lg z-10 flex flex-row"
            style={{ display: "none" }}
          >
            <button
              onClick={() => this.applyStyle("bold")}
              className="font-bold p-1 hover:bg-gray-600 rounded"
            >
              B
            </button>
            <button
              onClick={() => this.applyStyle("italic")}
              className="italic p-1 hover:bg-gray-600 rounded"
            >
              I
            </button>
            <button
              onClick={() => this.applyStyle("underline")}
              className="underline p-1 hover:bg-gray-600 rounded"
            >
              U
            </button>
            <button
              onClick={() => this.applyStyle("strikeThrough")}
              className="line-through p-1 hover:bg-gray-600 rounded"
            >
              S
            </button>
          </div>
        </div>
      </>
    );
  }

  productionRender(): JSX.Element {
    const tag = (this.getSetting("html_tag")?.value || "p") as string;
    const fontSize = (this.getSetting("text_size")?.value || 1) as number;
    const htmlContent = (this.getSetting("html_content")?.value ||
      "") as string;
    const textAlign = (this.getSetting("text_align")?.value ||
      "start") as string;
    const textWidth = (this.getSetting("width")?.value || "full") as string;
    const textColor = (this.getSetting("color")?.value || "#000") as string;
    const lineHeight = (this.getSetting("line_height")?.value || 0) as number;
    const letterSpacing = (this.getSetting("letter_spacing")?.value ||
      0) as number;
    const font = this.getSetting("font")?.value || "Arial, sans-serif";

    const icon = this.getSetting("icon")?.value || undefined;
    const iconColor = this.getSetting("icon_color")?.value || "#000";

    const root = this.rootComponent as RootComponent;
    const product = !root
      ? "N/A"
      : root.product
        ? root.product.name
        : "Unknown!";

    // Call getHtmlTag to generate the appropriate tag with props
    const tagElement = this.getHtmlTag(tag, {
      className: `text-gray-800 h-full font-medium p-2`,
      style: {
        fontSize: fontSize + "rem",
        textAlign: textAlign,
        color: textColor,
        lineHeight: fontSize + lineHeight + "rem",
        letterSpacing: letterSpacing,
        fontFamily: font,
        height: "100%",
      },
      dangerouslySetInnerHTML: {
        __html: htmlContent.replaceAll("{{PRODUCT_NAME}}", product),
      },
      id: this.randomId,
    });

    type IconName = keyof typeof FaIcons;

    return !icon ? (
      tagElement as JSX.Element
    ) : (
      <div className="flex flex-row items-center space-x-2">
        <IconRenderer
          icon={icon as IconName}
          size={fontSize}
          color={iconColor as string}
        />
        {tagElement}
      </div>
    );
  }

  clone() {
    return new TextComponent();
  }
}
