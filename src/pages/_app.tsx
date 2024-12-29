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
    console.log(host);
    console.log(
      `trying to search for domain ${host} or ${host.split(".")[0].toLowerCase()}`,
    );
    const domainMain = await prisma.page_domains.findFirst({
      where: { domain: host },
    });
    if (!domainMain) {
      const domainSystem = await prisma.page_domains.findFirst({
        where: { domain: host.split(".")[0].toLowerCase() },
      });
      if (!domainSystem) {
        return { host: null, originalHost: host };
      }
      return { host: domainSystem ? domainSystem : null, originalHost: host };
    } else {
      return { host: domainMain ? domainMain : null, originalHost: host };
    }
  } catch (error) {
    return { host: null, originalHost: host };
  }
};
