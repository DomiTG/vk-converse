import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPageContext } from "next";
import prisma from "@/lib/prisma";
import DomainNotFoundComponent from "@/components/DomainNotFoundComponent";
import { useEffect, useState } from "react";
import IProduct from "@/components/editor/interfaces/IProduct";
import { ConverseProvider } from "@/components/contexts/ConverseContext";
import ITemplate from "@/components/editor/interfaces/ITemplate";
import { matchPage } from "@/utils/loader";
import IPage from "@/components/editor/interfaces/IPage";

type Props = { host: any | null; originalHost: string; notFound?: boolean };

export default function MyApp({
  Component,
  pageProps,
  host,
  originalHost,
  notFound,
}: AppProps & Props) {
  const [page, setPage] = useState<IPage | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    if (!host) return;
    console.log(host);
    if (!host.converse.page) return console.log("no page");
    const page = host.converse.page as IPage;
    setPage(page);
    if (!host.converse.product) return console.log("no product");
    const product = host.converse.product as IProduct;
    setProduct(product);
    console.log("loaded in", product.id, page.name);
  }, [host]);

  if (notFound) {
    return <h1>Not found</h1>;
  }

  if (host === null) {
    return <DomainNotFoundComponent host={originalHost} />;
  }
  return (
    <ConverseProvider value={{ page, setPage, product, setProduct }}>
      <Component {...pageProps} />
    </ConverseProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const pathName = ctx.asPath;
  const host = ctx.req?.headers.host;
  if (!host) {
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
            product: true,
            template: true,
            type: true,
            updated_at: true,
          },
        },
      },
    });
    const template = (await JSON.parse(
      domainMain?.converse.template || "{}",
    )) as ITemplate;

    const page = matchPage(template.pages, pathName || "/");
    if (!page) {
      return { host: null, originalHost: host, notFound: true };
    }

    console.log(page);

    return {
      host: domainMain
        ? {
            ...domainMain,
            converse: {
              ...domainMain.converse,
              page,
            },
          }
        : null,
      originalHost: host,
    };
  } catch (error) {
    return { host: null, originalHost: host };
  }
};
