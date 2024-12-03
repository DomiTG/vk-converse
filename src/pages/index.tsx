import type { GetServerSideProps } from "next";

type Props = { host: string | null };

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => ({ props: { host: context.req.headers.host || null } });

export default function Home({ host }: Props) {
  return (
    <div>
      <h1 className="text-xl">Oh, nice. it works!</h1>
      <p className="text-sm">
        Currently, you are on <code>{host}</code>
      </p>
    </div>
  );
}
