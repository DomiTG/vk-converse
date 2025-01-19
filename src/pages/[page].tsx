import PageHandler from "@/components/PageHandler";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { NextPageContext } from "next";
import { usePathname } from "next/navigation";

export const getServerSideProps = (async () => {
  return { props: { test: null } };
}) satisfies GetServerSideProps<{ test: any }>;

export default function Page({
  test,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <></>;
}
