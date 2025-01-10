import { useEffect, useState } from "react";
import { useConverse } from "./contexts/ConverseContext";
import IEditorPage from "./editor/interfaces/IEditorPage";
import RootComponent from "./editor/components/RootComponent";
import IPage from "./editor/interfaces/IPage";
import { loadTemplateJson } from "@/utils/loader";

export default function PageHandler({ route }: { route: string }) {
  const [page, setPage] = useState<IEditorPage | null>(null);
  const [updateFlag, setUpdateFlag] = useState(false);
  const { converse } = useConverse();

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
    console.log(page.components);
    const pages = loadTemplateJson(page);
    setPage(pages);
  }, [converse]);

  if (!converse) return null;
  return (
    <>
      {page
        ? updateFlag
          ? render(page, toggle)
          : render(page, toggle)
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
