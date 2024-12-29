import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPageContext } from "next";
import prisma from "@/lib/prisma";
import DomainNotFoundComponent from "@/components/DomainNotFoundComponent";

type Props = { host: object | null; originalHost: string };

export default function MyApp({
  Component,
  pageProps,
  host,
  originalHost,
}: AppProps & Props) {
  if (host === null) {
    return <DomainNotFoundComponent host={originalHost} />;
  }
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const host = ctx.req?.headers.host;
  if (!host) {
    return { host: null, originalHost: null };
  }
  try {
    const domain = await prisma.page_domains.findFirst({
      where: { domain: host || host.split(".")[0].toLowerCase() },
    });
    return { host: domain ? domain : null, originalHost: host };
  } catch (error) {
    return { host: null, originalHost: host };
  }
};
