import { TTimeline } from "./useTimeline";
import Symbol from "./Symbol";

export default function ScaledValues({ timeline }: { timeline: TTimeline}) {

  return (
    <div className="App" style={{ display: "flex", flexDirection: "row", flexFlow: "wrap" }}>
      {Object.keys(timeline).map((symbol) => (
        <Symbol
          symbol={symbol}
          ethFn={(x) => (Number(x.data.valueETH) / Number(timeline[symbol][0].data.valueETH))}
          usdFn={(x) => (Number(x.data.valueUSD) / Number(timeline[symbol][0].data.valueUSD))}
        />)
      )}
    </div>
  );
}
