import { useEffect, useState } from "react";

export default function Home() {
  const [counter, setCounter] = useState(0);

  useEffect(() => console.log("a"), [counter]);
  return (
    <div>
      <p className="text-2xl">Counter: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>Increment</button>
    </div>
  );
}
