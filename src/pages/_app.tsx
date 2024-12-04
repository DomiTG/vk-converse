import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";

type Props = { host: string | null };

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const host = context.req.headers.host;
  try {
    const res = await prisma.page_domains.findFirst({
      where: {
        domain: host,
      },
    });
    console.log(res);
    console.log(host);
    if (res) {
      return {
        props: {
          host: res.domain,
        },
      };
    } else {
      return {
        props: {
          host: null,
        },
      };
    }
  } catch (error) {
    console.error(error);
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
  console.log(host);
  return host === null ? <div>404</div> : <Component {...pageProps} />;
}
