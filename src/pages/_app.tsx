import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPageContext } from "next";
import prisma from "@/lib/prisma";

type Props = { host: string | null };

export default function MyApp({
  Component,
  pageProps,
  host,
}: AppProps & Props) {
  console.log("server-side resolved host:", host);

  if (host === null) {
    return <div>404 - Domain Not Found</div>;
  }

  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const host = ctx.req?.headers.host;
  console.log(ctx.req);
  if (!host) {
    console.log("no host");
    return { host: null };
  }
  try {
    const domain = await prisma.page_domains.findFirst({
      where: { domain: host.toLowerCase() },
    });
    console.log(domain);
    return { host: domain ? domain : null };
  } catch (error) {
    console.error(error);
    return { host: null };
  }
};
