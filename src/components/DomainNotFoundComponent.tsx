import Link from "next/link";

export default function DomainNotFoundComponent({ host }: { host: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-900 bg-gradient-to-br from-neutral-800 to-neutral-900">
      <div className="backdrop-blur-lg bg-neutral-800/60 max-w-sm md:max-w-md w-full p-8 rounded-xl border border-neutral-700">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl lg:textl-xl xl:text-4xl font-extrabold text-white uppercase">
            Vytvorkonverzku
          </h1>
          <p className="mt-4 text-sm text-neutral-400">
            The domain{" "}
            <span className="font-semibold text-white text-md">{host}</span> is
            connected but not recognized by{" "}
            <span className="font-bold text-white uppercase text-md tracking-wide">
              Vytvorkonverzku
            </span>
            .
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-block px-4 py-2 text-sm text-neutral-900 bg-white rounded-lg shadow-sm hover:bg-neutral-200 transition uppercase font-semibold"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
