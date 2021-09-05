import Symbol from "./Symbol";
import { TimelineContext } from "./TimelineContext";

export default function ScaledValues() {

  return (
    <TimelineContext.Consumer>
      {({ timeline }) => (
        <div className="App" style={{ display: "flex", flexDirection: "row", flexFlow: "wrap" }}>
          {Object.keys(timeline).map((symbol) => (
            <Symbol
              symbol={symbol}
              ethFn={(x) => (Number(x.data.valueETH) / Number(timeline[symbol][0].data.valueETH))}
              usdFn={(x) => (Number(x.data.valueUSD) / Number(timeline[symbol][0].data.valueUSD))}
            />)
          )}
        </div>
      )}
    </TimelineContext.Consumer>
    
  );
}
