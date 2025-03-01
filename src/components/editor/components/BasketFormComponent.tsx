import { FaCartPlus, FaLock } from "react-icons/fa";
import IEditorComponent from "../classes/IEditorComponent";
import { useEffect, useRef, useState } from "react";
import RootComponent from "./RootComponent";
import { FaChevronDown } from "react-icons/fa6";
import IShippingMethod from "../interfaces/IShippingMethod";
import Script from "next/script";
import IPaymentMethod from "../interfaces/IPaymentMethod";
import { useConverse } from "@/components/contexts/ConverseContext";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import ISetting from "../interfaces/ISetting";

export default class BasketFormComponent extends IEditorComponent {
  constructor() {
    super(
      "Basket form",
      "Formulář pro výběr produktů",
      "basketForm",
      FaCartPlus,
      [
        {
          "id": "SUCCESS_PAGE",
          "type": "PAGE",
          "name": "Stránka po úspěšném odeslání",
          "value": null,
          "visible": true
        },
        {
          "id": "ERROR_PAGE",
          "type": "PAGE",
          "name": "Stránka po neúspěšném odeslání",
          "value": null,
          "visible": true
        }
      ],
    );
  }

  render(): JSX.Element {
    if (!this.rootComponent) return <div>Root component not found</div>;
    return (
      <BasketForm
        rootComponent={this.rootComponent! as RootComponent}
        production={false}
        settings={this.settings}
      />
    );
  }

  productionRender(): JSX.Element {
    if (!this.rootComponent) return <div>Root component not found</div>;
    return (
      <BasketForm
        rootComponent={this.rootComponent! as RootComponent}
        production
        settings={this.settings}
      />
    );
  }

  clone() {
    return new BasketFormComponent();
  }
}

const BasketForm = ({
  rootComponent,
  production,
  settings
}: {
  rootComponent: RootComponent;
  production: boolean;
  settings: ISetting[];
}) => {
  const { product, currency, converseId, captchaSiteKey } = useConverse();

  const [showBasket, setShowBasket] = useState<boolean>(false);
  const [mainProductCount, setMainProductCount] = useState<number>(1);
  const [shippingMethod, setShippingMethod] = useState<IShippingMethod | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod | null>(
    null,
  );
  const [text, setText] = useState<string>("");

  const [packetaId, setPacketaId] = useState<string>("");
  const [packetaPlace, setPacketaPlace] = useState<string | null>(null);
  const [productPrice, setProductPrice] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const captchaRef = useRef<ReCAPTCHA>(null);

  const getConverseCurrencyFromPrices = (prices: any) => {
    if (!currency) return { currency: "NONE", price: 0 };
    const price = JSON.parse(prices);
    if (!price) return { currency: "NONE", price: 0 };
    const found = price.find((p: any) => p.currency === currency);
    if (!found) return { currency: "NONE", price: 0 };
    return found;
  };

  const handleShippingMethod = async (method: IShippingMethod) => {
    console.log("handlin");
    switch (method.integration) {
      case "PACKETA":
        console.log("packeta");
        const Packeta = (window as any).Packeta;
        if (!Packeta) return setText("Packeta not found");

        const settings = await JSON.parse(method.settings);
        if (!settings) return;
        if (!settings.type) return;
        if (settings.type === "PICKUP_POINT") {
          console.log("Here");
          // handle pick up point
          const packetaApiKey = "ahoj";

          const packetaOptions = {
            language: "cs",
            valueFormat:
              '"Packeta",id,carrierId,carrierPickupPointId,name,city,street',
            view: "modal",
          };

          const handlePacketaPickup = async (point: any) => {
            if (!point) {
              return;
            }
            setPacketaId(point.id);
            setPacketaPlace(point.name);
            setShippingMethod(method);
          };

          await Packeta.Widget.pick(
            packetaApiKey,
            handlePacketaPickup,
            packetaOptions,
          );
        } else {
          setShippingMethod(method);
        }
        break;
      case "NONE":
        setShippingMethod(method);
        break;
      default:
        setShippingMethod(method);
        break;
    }
  };

  useEffect(() => {
    if (!product) return;
    const handle = async () => {
      const price = getConverseCurrencyFromPrices(product.prices);
      if (!price) return;
      setProductPrice(price.price);
    };
    handle();
  }, [product]);

  const calculateFinalPrice = () => {
    const product = productPrice * mainProductCount;
    const shipping = getConverseCurrencyFromPrices(
      JSON.stringify(shippingMethod?.prices || []),
    ).price; // shipping price
    const payment = getConverseCurrencyFromPrices(
      JSON.stringify(paymentMethod?.prices || []),
    ).price;
    return product + shipping + payment;
  };

  if (!product) return <div>Product not found</div>;

  const handleSubmit = async () => {
    if(loading) return;
    try {
      let additional = {};
      if(!shippingMethod) return;
      if(!paymentMethod) return;
      if(shippingMethod.integration === "PACKETA") {
        additional = {
          packeta_id: packetaId,
        };
      }
      const token = await captchaRef.current?.executeAsync();
      if(!token) return;
      setLoading(true);

      //should return http://something.tld
      const rootUrl = window.location.origin;
      const successPage = settings.find(setting => setting.id === "SUCCESS_PAGE")?.value;
      const errorPage = settings.find(setting => setting.id === "ERROR_PAGE")?.value;

      if(!successPage) {
        setLoading(false);
        return setText("Není nastavena stránka po úspěšném odeslání");
      }

      if(!errorPage) {
        setLoading(false);
        return setText("Není nastavena stránka po neúspěšném odeslání");
      }

      const result = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        body: JSON.stringify({
          currency: currency,
          converse_id: converseId,
          product: {
            quantity: mainProductCount,
          },
          contact_details: {
            first_name: (document.getElementById("basket_firstname") as HTMLInputElement).value,
            last_name: (document.getElementById("basket_lastname") as HTMLInputElement).value,
            email: (document.getElementById("basket_email") as HTMLInputElement).value,
            phone: (document.getElementById("basket_phone") as HTMLInputElement).value,
          },
          delivery_details: {
            city: (document.getElementById("basket_city") as HTMLInputElement).value,
            postal_code: (document.getElementById("basket_zip") as HTMLInputElement).value,
            street: (document.getElementById("basket_street") as HTMLInputElement).value,
            house_number: (document.getElementById("basket_street_number") as HTMLInputElement).value,
            country: (document.getElementById("basket_country") as HTMLSelectElement).value,
          },
          shipping_method: shippingMethod.id,
          payment_method: paymentMethod.id,
          success_url: `${rootUrl}/${successPage}`,
          error_url: `${rootUrl}/${errorPage}`,
          additional: {
            ...additional,
          }
        }),
        headers: {
          "Content-Type": "application/json",
          "x-captcha-token": token,
        },
      });
      const data = await result.json();
      if(data.success) {
        if(data.url) {
          window.location.href = data.url;
        } else {
          window.location.href = `${rootUrl}/${successPage}`;
        }
      } else {
        setText("Něco se pokazilo, zkuste to prosím znovu");
      }
      setLoading(false);
    } catch(err) {
      setLoading(false);
      console.error(err);
    }
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Basket Summary Header */}
      <div
        className="flex justify-between items-center p-6 cursor-pointer transition-colors duration-200 hover:bg-gray-50 rounded-xl"
        onClick={() => setShowBasket(!showBasket)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <FaCartPlus className="text-xl text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Shrnutí</h3>
            <p className="text-sm text-gray-500">
              Klikni pro {showBasket ? "skrytí" : "zobrazení"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-900">
            {mainProductCount}{" "}
            {mainProductCount !== 1 ? "produkty" : "produktů"}
          </span>
          <FaChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${showBasket ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Expanded Basket Content */}
      {showBasket && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
          {/* Main Product Card */}
          <div className="p-4 bg-white rounded-lg shadow-xs border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={product.image_url || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                  crossOrigin="anonymous"
                  width={80}
                  height={80}
                />
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    {product.name || "Main Product"}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() =>
                        setMainProductCount(Math.max(1, mainProductCount - 1))
                      }
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900">
                      {mainProductCount}
                    </span>
                    <button
                      className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => setMainProductCount(mainProductCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <span className="text-base font-medium text-gray-900">
                {productPrice.toLocaleString()} Kč
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Mezisoučet</span>
              <span className="text-gray-900">
                {(productPrice * mainProductCount).toLocaleString()} Kč
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Doprava</span>
              <span className="text-gray-900">
                {shippingMethod
                  ? (
                      getConverseCurrencyFromPrices(
                        JSON.stringify(shippingMethod.prices),
                      ).price || 0
                    ).toLocaleString()
                  : 0}{" "}
                Kč
              </span>
            </div>
            {paymentMethod &&
              getConverseCurrencyFromPrices(
                JSON.stringify(paymentMethod.prices),
              ).price > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Platba</span>
                  <span className="text-gray-900">
                    {
                      getConverseCurrencyFromPrices(
                        JSON.stringify(paymentMethod.prices),
                      ).price
                    }{" "}
                    Kč
                  </span>
                </div>
              )}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Celková cena</span>
                <span className="font-medium text-gray-900">
                  {calculateFinalPrice().toLocaleString()} Kč
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Kontaktní údaje
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Křestní jméno" id="basket_firstname" />
                <Input placeholder="Příjmení" id="basket_lastname" />
                <Input
                  className="col-span-2"
                  placeholder="Emailová adresa"
                  type="email"
                  id="basket_email"
                />
                <Input
                  className="col-span-2"
                  placeholder="Telefonní číslo"
                  type="tel"
                  id="basket_phone"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Adresa doručení
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Město" id="basket_city" />
                <Input placeholder="PSČ" id="basket_zip" />
                <Input placeholder="Ulice" id="basket_street" />
                <Input placeholder="Číslo popisné" id="basket_street_number" />
                <select
                  className="col-span-2 rounded-lg p-2 border border-gray-100 bg-gray-50 text-gray-900 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  id="basket_country"
                >
                  <option value="CZE">Česká republika</option>
                  <option value="SVK">Slovensko</option>
                  <option value="POL">Polsko</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Možnost doručení
              </h3>
              <div className="space-y-3">
                {rootComponent?.shippingMethods.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                    Nebyly nalezeny žádné možnosti doručení
                  </div>
                ) : (
                  rootComponent?.shippingMethods.map((method, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-primary-300 transition-colors cursor-pointer ${
                        shippingMethod?.id === method.id
                          ? "border-green-300"
                          : ""
                      }`}
                      onClick={() => handleShippingMethod(method)}
                    >
                      <div className="flex flex-col">
                        <span className="text-gray-900">{method.name}</span>
                        {method.integration === "PACKETA" &&
                          packetaPlace &&
                          JSON.parse(method.settings).type ===
                            "PICKUP_POINT" && (
                            <span className="text-xs text-gray-500">
                              {packetaPlace}
                            </span>
                          )}
                      </div>
                      <span className="text-gray-600">
                        {
                          getConverseCurrencyFromPrices(
                            JSON.stringify(method.prices),
                          ).price
                        }
                        Kč
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Platební metoda
              </h3>
              <div className="space-y-3">
                {/* mock data */}
                {rootComponent?.paymentMethods.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                    Nebyly nalezeny žádné možnosti doručení
                  </div>
                ) : (
                  rootComponent?.paymentMethods.map((method, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-primary-300 transition-colors cursor-pointer ${
                        paymentMethod?.id === method.id
                          ? "border-green-300"
                          : ""
                      }`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <span className="text-gray-900">{method.name}</span>
                      <span className="text-gray-600">
                        {
                          getConverseCurrencyFromPrices(
                            JSON.stringify(method.prices),
                          ).price
                        }{" "}
                        Kč
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* terms of service */}
            <p className="text-sm text-gray-500">
              Kliknutím na tlačítko Odeslat objednávku souhlasíte s{" "}
              <span className="text-blue-500 cursor-pointer hover:underline">
                Obchodními podmínkami
              </span>{" "}
              a{" "}
              <span className="text-blue-500 cursor-pointer hover:underline">
                Zásadami ochrany osobních údajů
              </span>
              .
            </p>
            {!production && (
              <p className="text-red-500 text-xs">
                This form contains mock data, in production you will see your
                real data
              </p>
            )}
            {text && (
              <div className="p-4 bg-red-100 text-red-500 rounded-lg">
                {text}
              </div>
            )}
            <ReCAPTCHA  
              sitekey={captchaSiteKey || ""}
              size="invisible"
              ref={captchaRef}
            />
            <button className="w-full bg-blue-500 font-semibold text-white py-4 rounded-lg hover:bg-blue-600 transition-colors uppercase flex flex-row items-center justify-center disabled:opacity-50" onClick={handleSubmit} disabled={loading}>
              <FaLock className="text-xl mr-2" />
              {loading ? "Odesílám objednávku..." : "Odeslat objednávku"}
            </button>
          </div>
        </div>
      )}
      <Script src="https://widget.packeta.com/v6/www/js/library.js" />
    </div>
  );
};

// Reusable Input component for better consistency
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors ${className}`}
    {...props}
  />
);
