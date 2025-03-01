import IEditorComponent from "../../classes/IEditorComponent";
import { TbLayoutNavbar } from "react-icons/tb";
import RootComponent from "../RootComponent";
import FloatingAddCompComponent from "../../FloatingAddCompComponent";

export default class NavbarComponent extends IEditorComponent {
  initialized: boolean = false;

  constructor() {
    super(
      "Navbar Component",
      "A flex row component",
      "navbar",
      TbLayoutNavbar,
      [
        {
          id: "color",
          name: "Background",
          type: "COLOR",
          value: "#ffffff",
          visible: true,
        },
        {
          id: "test array",
          name: "Test Array",
          type: "SELECT",
          value: "1",
          options: [
            { id: "1", name: "Option 1" },
            { id: "2", name: "Option 2" },
            { id: "3", name: "Option 3" },
          ],
          visible: true,
        },
      ],
    );
  }

  render() {
    if (!this.initialized && this.subComponents.length === 0) {
      this.initialized = true;

      const rootComp = this.rootComponent as RootComponent;
      if (!rootComp) return <div>Root component not found</div>;
      const flexComp = rootComp.getComponentById("flex");
      if (!flexComp) return <div>Flex comp not found</div>;
      const flexRowCompC = flexComp.clone();
      const alignSetting = flexRowCompC.getSetting("align");
      const justifySetting = flexRowCompC.getSetting("justify");
      const directionSetting = flexRowCompC.getSetting("direction");
      if (!alignSetting || !justifySetting || !directionSetting)
        return <div>Settings not found</div>;
      alignSetting.value = "center";
      justifySetting.value = "center";
      directionSetting.value = "row";
      flexRowCompC.setRootComponent(rootComp);

      //text
      const textComp = rootComp.getComponentById("text");
      if (!textComp) return <div>Text comp not found</div>;
      const textCompC = textComp.clone();
      textCompC.setRootComponent(rootComp);

      //logo
      const imageComp = rootComp.getComponentById("image");
      if (!imageComp) return <div>Image comp not found</div>;
      const imageCompC = imageComp.clone();
      const imageSetting = imageCompC.getSetting("image");
      const altSetting = imageCompC.getSetting("alt");
      const widthSetting = imageCompC.getSetting("width");
      const heightSetting = imageCompC.getSetting("height");
      if (!imageSetting || !altSetting || !widthSetting || !heightSetting)
        return <div>Settings not found</div>;
      imageSetting.value = "https://cdn.vytvorkonverzku.cz/4/fon5yfa56b5";
      altSetting.value = "Logo";
      widthSetting.value = "50";
      heightSetting.value = "50";
      imageCompC.setRootComponent(rootComp);

      //add to flex row
      flexRowCompC.addSubComponent(imageCompC);
      flexRowCompC.addSubComponent(textComp);

      this.addSubComponent(flexRowCompC);
    }
    return (
      <nav
        className={`relative p-2 hover:border hover:border-gray-700`}
        style={{
          backgroundColor:
            (this.getSetting("color")?.value as string) || "#ffffff",
        }}
        onMouseEnter={() => this.getHoveredComponentMethod()(this)}
        onMouseLeave={() => this.getHoveredComponentMethod()(null)}
      >
        {this.subComponents.map((component) => component.render())}
        {this.getHoveredComponentState() === this && (
          <FloatingAddCompComponent comp={this} position="top_right" />
        )}
      </nav>
    );
  }

  productionRender(): JSX.Element {
    return (
      <nav
        className="relative p-2 w-full"
        style={{
          backgroundColor:
            (this.getSetting("color")?.value as string) || "#ffffff",
        }}
      >
        {this.subComponents.map((component) => component.productionRender())}
      </nav>
    );
  }

  clone() {
    const clone = new NavbarComponent();
    return clone;
  }
}
