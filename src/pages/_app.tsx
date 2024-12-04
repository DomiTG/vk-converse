import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";

type Props = { host: string | null };

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  console.log("headers", context.req.headers);
  console.log("calling getServerSideProps");
  const host = context.req.headers.host;

  console.log("host header:", host);
  if (!host) {
    console.error("Host header is missing");
    return {
      props: {
        host: null,
      },
    };
  }

  try {
    const domainRecord = await prisma.page_domains.findFirst({
      where: {
        domain: host,
      },
    });

    console.log("Domain record:", domainRecord);

    return {
      props: {
        host: domainRecord?.domain || null,
      },
    };
  } catch (error) {
    console.error("Error querying the database:", error);
    return {
      props: {
        host: null,
      },
    };
  }
};

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
