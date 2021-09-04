import { TTimeline } from "./useTimeline";
import Symbol from "./Symbol";

export default function TrueValues({ timeline }: { timeline: TTimeline}) {

  return (
    <div className="App" style={{ display: "flex", flexDirection: "row", flexFlow: "wrap" }}>
      {Object.keys(timeline).map((symbol) => (<Symbol symbol={symbol} />))}
    </div>
  );
}
