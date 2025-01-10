import { FaPlus, FaSquareRootAlt } from "react-icons/fa";
import IEditorComponent from "../classes/IEditorComponent";
import TextComponent from "./TextComponent";
import NavbarComponent from "./navbar/NavbarComponent";
import NavbarLinkComponent from "./navbar/NavbarLinkComponent";
import ImageElement from "../elements/ImageElement";
import OwnHTMLElement from "../elements/OwnHTMLElement";
import FlexComponent from "./FlexComponent";
import VideoElement from "../elements/VideoElement";
import EmbedElement from "../elements/EmbedElement";
import CountdownComponent from "./CountdownComponent";
import ContainerComponent from "./ContainerComponent";
import IProduct from "../interfaces/IProduct";
import ButtonComponent from "../elements/ButtonComponent";
import MarginElement from "../elements/MarginElement";

export default class RootComponent extends IEditorComponent {
  availableComponents: { category: string; components: IEditorComponent[] }[] =
    [
      {
        category: "Rozvržení",
        components: [new FlexComponent(), new ContainerComponent()],
      },
      {
        category: "Elementy",
        components: [
          new TextComponent(),
          new ImageElement(),
          new VideoElement(),
          new OwnHTMLElement(),
          new EmbedElement(),
          new CountdownComponent(),
          new ButtonComponent(),
          new MarginElement(),
        ],
      },
      {
        category: "Komponenty",
        components: [new NavbarComponent(), new NavbarLinkComponent()],
      },
    ];

  product: IProduct | null = null;

  constructor() {
    super(
      "Root",
      "Kořenový element je základním prvkem celé stránky. Můžete zde přidávat další komponenty a elementy.",
      "root",
      FaSquareRootAlt,
    );
  }

  init(
    updateMethod: (component: IEditorComponent) => void,
    setModal?: (component: IEditorComponent) => void,
    setSelectedComponent?: (component: IEditorComponent) => void,
    setHoveredComponent?: (component: IEditorComponent | null) => void,
  ) {
    this.setRootComponent(this);
    this.updateMethod = updateMethod;
    console.log(this.updateMethod);
    if (setModal) this.setModal = setModal;
    if (setSelectedComponent) this.setSelectedComponent = setSelectedComponent;
    if (setHoveredComponent) this.setHoveredComponent = setHoveredComponent;
  }

  getProduct() {
    return this.product;
  }

  setProduct(product: IProduct | null) {
    this.product = product;
    return this.product;
  }

  render() {
    return (
      <div className="relative w-full flex flex-col">
        {this.subComponents.map((component) => component.render())}
        <div className="w-full flex flex-col justify-center items-center p-4">
          <div
            className="w-24 h-24 bg-gray-200 flex items-center justify-center text-zinc-500 text-2xl rounded-lg cursor-pointer hover:bg-gray-300"
            onClick={() => this.getModalMethod()(this)}
          >
            <FaPlus />
          </div>
        </div>
      </div>
    );
  }

  productionRender(): JSX.Element {
    return (
      <>{this.subComponents.map((component) => component.productionRender())}</>
    );
  }

  clone(): IEditorComponent {
    return new RootComponent();
  }

  getAllComponents(): IEditorComponent[] {
    return this.availableComponents
      .map((category) => category.components)
      .flat();
  }

  getComponentById(id: string): IEditorComponent | undefined {
    return this.getAllComponents().find((component) => component.id === id);
  }
}
