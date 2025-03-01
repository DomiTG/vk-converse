import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPageContext } from "next";
import prisma from "@/lib/prisma";
import DomainNotFoundComponent from "@/components/DomainNotFoundComponent";
import { useEffect, useState } from "react";
import IProduct from "@/components/editor/interfaces/IProduct";
import { ConverseProvider } from "@/components/contexts/ConverseContext";
import ITemplate from "@/components/editor/interfaces/ITemplate";
import { Montserrat } from "next/font/google";
import IShippingMethod from "@/components/editor/interfaces/IShippingMethod";
import IPaymentMethod from "@/components/editor/interfaces/IPaymentMethod";
import IConverseSeo from "@/components/editor/interfaces/IConverseSeo";

type Props = {
  host: any | null;
  originalHost: string;
  shippingMethods: IShippingMethod[];
  paymentMethods: IPaymentMethod[];
  siteKey: string | null;
};

const mt = Montserrat({ subsets: ["latin", "latin-ext"] });
export default function MyApp({
  Component,
  pageProps,
  host,
  originalHost,
  shippingMethods,
  paymentMethods,
  siteKey,
}: AppProps & Props) {
  const [converse, setConverse] = useState<ITemplate | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [shipmentMethods, setShipmentMethods] = useState<IShippingMethod[]>([]);
  const [payMethods, setPayMethods] = useState<IPaymentMethod[]>([]);
  const [currency, setCurrency] = useState<"CZK" | "EUR" | "USD" | "NONE">(
    "NONE",
  );
  const [converseId, setConverseId] = useState<string | null>(null);
  const [seo, setSeo] = useState<IConverseSeo | null>(null);
  const [captchaSiteKey, setCaptchaSiteKey] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.className = `${mt.className}`;
  }, []);

  useEffect(() => {
    console.log(host);
    if (!host) return;
    if (!host.converse.template) return console.log("no template");
    const template = host.converse.template as ITemplate;
    setConverse(template);
    const currency = host.converse.currency as "CZK" | "EUR" | "USD";
    setCurrency(currency);
    if (!host.converse.product) return console.log("no product");
    const product = host.converse.product as IProduct;
    setProduct(product);
    if (shipmentMethods) {
      setShipmentMethods(shippingMethods);
    }
    if (payMethods) {
      setPayMethods(paymentMethods);
    }

    if (host.converse.id) {
      console.log(host.converse.id)
      setConverseId(host.converse.id);
    }
    if(host.converse.seo && host.converse.seo[0]){
      setSeo(host.converse.seo[0]);
    }
    if(siteKey) {
      setCaptchaSiteKey(siteKey);
    }
    console.log("loaded in", product.id, template.pages);
  }, [host]);

  if (host === null) {
    return <DomainNotFoundComponent host={originalHost} />;
  }

  if(!captchaSiteKey) {
    return <div>ddLoading...</div>
  }

  return (
    <ConverseProvider
      value={{
        converse,
        setConverse,
        product,
        setProduct,
        converseId,
        setConverseId,
        shippingMethods: shipmentMethods,
        setShippingMethods: setShipmentMethods,
        paymentMethods: payMethods,
        setPaymentMethods: setPayMethods,
        currency,
        setCurrency,
        seo,
        setSeo,
        captchaSiteKey,
        setCaptchaSiteKey,
      }}
    >
      <Component {...pageProps} />
    </ConverseProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const host = ctx.req?.headers.host;
  console.log(host)
  if (!host) {
    console.log("no host")
    return { host: null, originalHost: null };
  }
  try {
    const domainMain = await prisma.page_domains.findFirst({
      where: { domain: host },
      select: {
        id: true,
        created_at: true,
        domain: true,
        system_domain: true,
        converse: {
          select: {
            id: true,
            created_at: true,
            description: true,
            live_mode: true,
            name: true,
            template: true,
            currency: true,
            type: true,
            updated_at: true,
            product: true,
            converse_shipping_methods: true,
            converse_payment_methods: true,
            seo: true
          },
        },
      },
    });
    let shippingMethods: IShippingMethod[] = [];
    let paymentMethods: IPaymentMethod[] = [];
    if (domainMain && domainMain.converse) {
      shippingMethods = (await Promise.all(
        domainMain.converse.converse_shipping_methods.map(async (method) => {
          return { ...method, prices: await JSON.parse(method.prices) };
        }),
      )) as IShippingMethod[];

      paymentMethods = (await Promise.all(
        domainMain.converse.converse_payment_methods.map(async (method) => {
          return { ...method, prices: await JSON.parse(method.prices) };
        }),
      )) as IPaymentMethod[];
    }

    let captchaSiteKey = null;
    if (domainMain && domainMain.converse) {
      const captchaIntegration = await prisma.converse_integrations.findFirst({
        where: {
          converse_id: domainMain.converse.id,
          integration_type: "CAPTCHA",
        },
      });
      if (captchaIntegration) {
        const values = await JSON.parse(captchaIntegration.values);
        console.log(values)
        captchaSiteKey = values.find((value: any) => value.key === "SITE_KEY")?.value;
      }
    }

    const template = await JSON.parse(domainMain?.converse.template || "{}");

    return {
      host: domainMain
        ? {
            ...domainMain,
            converse: {
              ...domainMain.converse,
              template,
            },
          }
        : null,
      shippingMethods,
      paymentMethods,
      originalHost: host,
      siteKey: captchaSiteKey,
    };
  } catch (error) {
    console.log(error)
    return { host: null, originalHost: host };
  }
};
