import { useEffect, useState } from "react";
import { useConverse } from "./contexts/ConverseContext";
import IEditorPage from "./editor/interfaces/IEditorPage";
import RootComponent from "./editor/components/RootComponent";
import { loadTemplateJson } from "@/utils/loader";
import { NextPageContext } from "next";

export default function PageHandler({ route }: { route: string }) {
  const [parsedPage, setPardedPage] = useState<IEditorPage | null>(null);
  const [updateFlag, setUpdateFlag] = useState(false);
  const { page } = useConverse();

  const toggle = () => {
    setUpdateFlag(!updateFlag);
  };

  useEffect(() => {
    if (!page) return;
    const pages = loadTemplateJson(page);
    setPardedPage(pages);
  }, [page]);

  if (!parsedPage) return null;
  return (
    <>
      {page
        ? updateFlag
          ? render(parsedPage, toggle)
          : render(parsedPage, toggle)
        : "404"}
    </>
  );
}

const render = (page: IEditorPage, updateMethod: () => void) => {
  let rootComponent = page.root_component as RootComponent;
  if (!rootComponent) {
    const rootComp = new RootComponent();
    rootComp.init(updateMethod);
    page.root_component = rootComp;
    rootComponent = rootComp;
  } else {
    if (!rootComponent.updateMethod) {
      rootComponent.init(updateMethod);
    }
  }
  return rootComponent.productionRender();
};

PageHandler.getStaticProps = async (ctx: NextPageContext) => {
  const route = ctx.pathname;
  console.log(route);
  return {
    props: { route },
  };
};
