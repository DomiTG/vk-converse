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
import BasketFormComponent from "./BasketFormComponent";
import IShippingMethod from "../interfaces/IShippingMethod";
import IPaymentMethod from "../interfaces/IPaymentMethod";

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
          new BasketFormComponent(),
        ],
      },
      {
        category: "Komponenty",
        components: [new NavbarComponent(), new NavbarLinkComponent()],
      },
    ];

  product: IProduct | null = null;
  shippingMethods: IShippingMethod[] = [];
  paymentMethods: IPaymentMethod[] = [];

  constructor() {
    super(
      "Root",
      "Kořenový element je základním prvkem celé stránky. Můžete zde přidávat další komponenty a elementy.",
      "root",
      FaSquareRootAlt,
    );
  }

  init(updateMethod: (component: IEditorComponent) => void) {
    this.setRootComponent(this);
    this.updateMethod = updateMethod;
  }

  getProduct() {
    return this.product;
  }

  setProduct(product: IProduct | null) {
    this.product = product;
    return this.product;
  }

  render() {
    if (this.shippingMethods && this.shippingMethods.length === 0) {
      this.shippingMethods.push({
        converse_id: "1",
        created_at: new Date(),
        description: "Pickup",
        id: 1,
        integration: "PACKETA",
        name: "CZ Zásilkovna",
        prices: [{ currency: "CZK", price: 100 }],
        settings: {
          type: "PICKUP_POINT",
        },
        updated_at: new Date(),
      } as IShippingMethod);
    }
    if (this.paymentMethods && this.paymentMethods.length === 0) {
      this.paymentMethods.push({
        id: 1,
        name: "Platba kartou",
        description: "Platba kartou",
        created_at: new Date(),
        updated_at: new Date(),
        converse_id: "1",
        integration: "STRIPE",
        prices: [{ currency: "CZK", price: 0 }],
      } as IPaymentMethod);
    }
    if (!this.product) {
      this.product = {
        attachments: [],
        created_at: new Date(),
        description: "Popis produktu",
        email_html_content: "",
        id: 1,
        image_url: "https://picsum.photos/200/300",
        name: "Produkt",
        prices: JSON.stringify([
          {
            currency: "CZK",
            price: 100,
          },
        ]),
        product_subtype: "PHYSICAL",
        product_type: "PRODUCT",
        tax_included: false,
        tax_payer: false,
        tax_rate: 0,
        updated_at: new Date(),
        weight: 1,
      };
    }
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
