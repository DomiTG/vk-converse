import { useEffect, useState } from "react";
import { useConverse } from "./contexts/ConverseContext";
import IEditorPage from "./editor/interfaces/IEditorPage";
import RootComponent from "./editor/components/RootComponent";
import IPage from "./editor/interfaces/IPage";
import { loadTemplateJson } from "@/utils/loader";
import IShippingMethod from "./editor/interfaces/IShippingMethod";
import IPaymentMethod from "./editor/interfaces/IPaymentMethod";
import CreatedWithComponent from "./CreatedWithComponent";
import Head from "next/head";

export default function PageHandler({ route }: { route: string }) {
  const [page, setPage] = useState<IEditorPage | null>(null);
  const [updateFlag, setUpdateFlag] = useState(false);
  const { converse, shippingMethods, paymentMethods, seo } = useConverse();

  const toggle = () => {
    setUpdateFlag(!updateFlag);
  };

  const matchPage = (pages: IPage[]): IPage | undefined => {
    if (!converse) return undefined;
    return route === "/"
      ? pages.find((page) => !page.url)
      : pages.find((page) => page.url === route);
  };

  useEffect(() => {
    if (!converse) return;
    const page = matchPage(converse.pages);
    if (!page) return console.log("Page not found");
    const pages = loadTemplateJson(page);
    setPage(pages);
  }, [converse]);

  if (!converse) return null;
  return (
    <>
      <Head>
        <title>{seo ? seo.title : "Neznámá konverzka"}</title>
        {seo ? seo.description ? <meta name="description" content={seo.description} /> : null : null}
        {seo ? seo.keywords ? <meta name="keywords" content={seo.keywords} /> : null : null}
        {seo ? seo.favicon ? <link rel="icon" href={seo.favicon} /> : null : null}
      </Head>
      {page
        ? updateFlag
          ? render(page, toggle, shippingMethods, paymentMethods)
          : render(page, toggle, shippingMethods, paymentMethods)
        : "404"}
      <CreatedWithComponent />
    </>
  );
}

const render = (
  page: IEditorPage,
  updateMethod: () => void,
  shippingMethods: IShippingMethod[],
  paymentMethods: IPaymentMethod[],
) => {
  let rootComponent = page.root_component as RootComponent;
  if (!rootComponent) {
    const rootComp = new RootComponent();
    rootComp.init(updateMethod);
    rootComp.shippingMethods = shippingMethods;
    rootComp.paymentMethods = paymentMethods;
    page.root_component = rootComp;
    rootComponent = rootComp;
  } else {
    if (!rootComponent.updateMethod) {
      rootComponent.shippingMethods = shippingMethods;
      rootComponent.paymentMethods = paymentMethods;
      rootComponent.init(updateMethod);
    }
  }
  return rootComponent.productionRender();
};
