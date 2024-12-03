export default function Home() {
  const getHost = () => {
    return window.location.host;
  };

  return (
    <div>
      <h1 className="text-xl">Oh, nice. it works!</h1>
      <p className="text-sm">
        Currently, you are on <code>{getHost()}</code>
      </p>
    </div>
  );
}
