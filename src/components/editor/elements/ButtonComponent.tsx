import { GiNextButton } from "react-icons/gi";
import IEditorComponent from "../classes/IEditorComponent";
import * as FaIcons from "react-icons/fa"; // Font Awesome icons
import IconRenderer from "@/components/IconRenderer";
import ButtonAction from "../settings/ButtonAction";

export default class ButtonComponent extends IEditorComponent {
  buttonAction: ButtonAction | null = null;
  constructor() {
    super(
      "Button",
      "Tlačítko, které můžete umístit kamkoliv na stránce.",
      "button",
      GiNextButton,
      [
        {
          id: "TEXT",
          name: "Text tlačítka",
          type: "TEXT",
          value: "Klikni zde",
          visible: true,
        },
        {
          id: "COLOR",
          name: "Barva tlačítka",
          type: "COLOR",
          value: "#000000",
          visible: true,
        },
        {
          id: "TEXT_COLOR",
          name: "Barva textu",
          type: "COLOR",
          value: "#ffffff",
          visible: true,
        },
        {
          id: "TEXT_SIZE",
          name: "Velikost textu",
          type: "RANGE",
          value: 1,
          rangeMin: 1,
          rangeMax: 2,
          rangeStep: 0.1,
          visible: true,
        },
        {
          id: "FONT_STYLE",
          name: "Styl písma",
          type: "SELECT",
          options: [
            { id: "normal", name: "Normální" },
            { id: "italic", name: "Kurzíva" },
          ],
          value: "normal",
          visible: true,
        },
        {
          id: "FONT_WEIGHT",
          name: "Tučnost písma",
          type: "RANGE",
          value: 400,
          rangeMin: 100,
          rangeMax: 900,
          rangeStep: 100,
          visible: true,
        },
        {
          id: "WIDTH",
          name: "Šířka tlačítka",
          type: "SELECT",
          options: [
            { id: "auto", name: "Automaticky" },
            { id: "full", name: "Na celou šířku" },
          ],
          value: "auto",
          visible: true,
        },
        {
          id: "PADDING_X",
          name: "Odsazení X",
          type: "NUMBER",
          value: 10,
          visible: true,
        },
        {
          id: "PADDING_Y",
          name: "Odsazení Y",
          type: "NUMBER",
          value: 10,
          visible: true,
        },
        {
          id: "BORDER_RADIUS",
          name: "Zaoblení rohů",
          type: "NUMBER",
          value: 5,
          visible: true,
        },
        {
          id: "ICON",
          name: "Ikonka",
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
          id: "ICON_SIZE",
          name: "Velikost ikonky",
          type: "RANGE",
          value: 1,
          rangeMin: 0.1,
          rangeMax: 2,
          rangeStep: 0.1,
          visible: true,
        },
        {
          id: "ICON_MARGIN",
          name: "Odsazení ikonky",
          type: "NUMBER",
          value: 5,
          visible: true,
        },
        {
          id: "ICON_COLOR",
          name: "Barva ikonky",
          type: "COLOR",
          value: "#ffffff",
          visible: true,
        },
        {
          id: "ACTION",
          name: "Akce",
          type: "SELECT",
          options: [
            { "id": "none", "name": "Žádná" },
            { "id": "openUrl", "name": "Otevřít" },
            { "id": "page", "name": "Přejít na stránku" },
          ],
          value: "none",
          visible: true,
        },
        {
          id: "ACTION_URL",
          name: "URL",
          type: "TEXT",
          value: "",
          visible: false,
          condition: (settings) => {
            return settings.find((setting) => setting.id === "ACTION")?.value === "openUrl";
          }
        },
        {
          id: "ACTION_PAGE",
          name: "Stránka",
          type: "PAGE",
          value: "",
          visible: false,
          condition: (settings) => {
            return settings.find((setting) => setting.id === "ACTION")?.value === "page";
          }
        }
      ],
    );
  }

  render(): JSX.Element {
    const width = (this.getSetting("WIDTH")?.value as string) || "auto";
    const paddingX = (this.getSetting("PADDING_X")?.value as number) || 10;
    const paddingY = (this.getSetting("PADDING_Y")?.value as number) || 10;
    const borderRadius =
      (this.getSetting("BORDER_RADIUS")?.value as number) || 5;
    const textColor =
      (this.getSetting("TEXT_COLOR")?.value as string) || "#ffffff";
    const fontStyle =
      (this.getSetting("FONT_STYLE")?.value as string) || "normal";
    const fontWeight = (this.getSetting("FONT_WEIGHT")?.value as number) || 400;
    const textSize = (this.getSetting("TEXT_SIZE")?.value as number) || 1;

    type IconName = keyof typeof FaIcons;
    const icon = (this.getSetting("ICON")?.value as string) || "";
    const iconMargin = (this.getSetting("ICON_MARGIN")?.value as number) || 5;
    const iconSize = (this.getSetting("ICON_SIZE")?.value as number) || 20;
    const iconColor =
      (this.getSetting("ICON_COLOR")?.value as string) || textColor;
    return (
      <button
        style={{
          backgroundColor: this.getSetting("COLOR")?.value as string,
          width: width === "full" ? "100%" : "auto",
          color: textColor,
          padding: `${paddingY}px ${paddingX}px`,
          border: "none",
          cursor: "pointer",
          borderRadius: borderRadius + "px",
          fontStyle: fontStyle,
          fontWeight: fontWeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${textSize}rem`,
        }}
        className="hover:opacity-90 transition duration-200"
        onMouseEnter={() => this.getHoveredComponentMethod()(this)}
        onMouseLeave={() => this.getHoveredComponentMethod()(null)}
        onClick={(e) => {
          e.preventDefault();
          this.getSelectedComponentMethod()(this);
        }}
      >
        {icon && (
          <IconRenderer
            icon={icon as IconName}
            color={iconColor}
            size={iconSize}
            style={{ marginRight: iconMargin + "px" }}
          />
        )}
        {(this.getSetting("TEXT")?.value as string) || "Klikni zde"}
      </button>
    );
  }

  productionRender(): JSX.Element {
    const width = (this.getSetting("WIDTH")?.value as string) || "auto";
    const paddingX = (this.getSetting("PADDING_X")?.value as number) || 10;
    const paddingY = (this.getSetting("PADDING_Y")?.value as number) || 10;
    const borderRadius =
      (this.getSetting("BORDER_RADIUS")?.value as number) || 5;
    const textColor =
      (this.getSetting("TEXT_COLOR")?.value as string) || "#ffffff";
    const fontStyle =
      (this.getSetting("FONT_STYLE")?.value as string) || "normal";
    const fontWeight = (this.getSetting("FONT_WEIGHT")?.value as number) || 400;
    const textSize = (this.getSetting("TEXT_SIZE")?.value as number) || 1;

    type IconName = keyof typeof FaIcons;
    const icon = (this.getSetting("ICON")?.value as string) || "";
    const iconMargin = (this.getSetting("ICON_MARGIN")?.value as number) || 5;
    const iconSize = (this.getSetting("ICON_SIZE")?.value as number) || 20;
    const iconColor =
      (this.getSetting("ICON_COLOR")?.value as string) || textColor;
    const action = this.getSetting("ACTION")?.value as string;
    const actionUrl = this.getSetting("ACTION_URL")?.value as string;
    const actionPage = this.getSetting("ACTION_PAGE")?.value as string;

    return (
      <button
        style={{
          backgroundColor: this.getSetting("COLOR")?.value as string,
          width: width === "full" ? "100%" : "auto",
          color: textColor,
          padding: `${paddingY}px ${paddingX}px`,
          border: "none",
          cursor: "pointer",
          borderRadius: borderRadius + "px",
          fontStyle: fontStyle,
          fontWeight: fontWeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${textSize}rem`,
        }}
        className="hover:opacity-90 transition duration-200"
        onClick={(e) => {
          e.preventDefault();
          console.log(action, actionUrl);
          if (action === "openUrl" && actionUrl) {
            window.location.href = actionUrl;
          } else if (action === "page" && actionPage) {
            window.location.href = `/${actionPage}`;
          }
        }}
      >
        {icon && (
          <IconRenderer
            icon={icon as IconName}
            color={iconColor}
            size={iconSize}
            style={{ marginRight: iconMargin + "px" }}
          />
        )}
        {(this.getSetting("TEXT")?.value as string) || "Klikni zde"}
      </button>
    );
  }

  clone(): IEditorComponent {
    return new ButtonComponent();
  }
}
