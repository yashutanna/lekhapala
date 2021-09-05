import Symbol from "./Symbol";
import { TimelineContext } from "./TimelineContext";

export default function TrueValues() {

  return (
    <TimelineContext.Consumer>
      {({ timeline }) => (
        <div className="App" style={{ display: "flex", flexDirection: "row", flexFlow: "wrap" }}>
        {Object.keys(timeline).map((symbol) => (<Symbol symbol={symbol} />))}
      </div>
      )}
    </TimelineContext.Consumer>
    
  );
}