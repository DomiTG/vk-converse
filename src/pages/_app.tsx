import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPageContext } from "next";
import prisma from "@/lib/prisma";
import DomainNotFoundComponent from "@/components/DomainNotFoundComponent";
import { useEffect, useState } from "react";
import IProduct from "@/components/editor/interfaces/IProduct";
import { ConverseProvider } from "@/components/contexts/ConverseContext";
import ITemplate from "@/components/editor/interfaces/ITemplate";

type Props = { host: any | null; originalHost: string };

export default function MyApp({
  Component,
  pageProps,
  host,
  originalHost,
}: AppProps & Props) {
  const [converse, setConverse] = useState<ITemplate | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    console.log(host);
    if (!host) return;
    if (!host.converse.template) return console.log("no template");
    const template = host.converse.template as ITemplate;
    setConverse(template);
    if (!host.converse.product) return console.log("no product");
    const product = host.converse.product as IProduct;
    setProduct(product);
    console.log("loaded in", product.id, template.pages);
  }, [host]);

  if (host === null) {
    return <DomainNotFoundComponent host={originalHost} />;
  }
  return (
    <ConverseProvider value={{ converse, setConverse, product, setProduct }}>
      <Component {...pageProps} />
    </ConverseProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
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
    const template = await JSON.parse(domainMain?.converse.template || "{}");
    console.log(template.pages[0].components);

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
      originalHost: host,
    };
  } catch (error) {
    return { host: null, originalHost: host };
  }
};
