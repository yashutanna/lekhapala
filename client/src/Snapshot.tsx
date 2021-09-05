import { TimelineContext } from "./TimelineContext";

export default function Snapshot() {
  return (
    <TimelineContext.Consumer>
      {({ snapshot }) => (
        <div className="App" style={{ display: "flex", flexDirection: "row", flexFlow: "wrap" }}>
          <div style={{ flex: 1, maxWidth: '50%', color: 'white', backgroundColor: "limegreen" }}>
            <h1>${Number(snapshot.totalUSDValue).toFixed(2)}</h1>
          </div>
          <div style={{ flex: 1, maxWidth: '50%', color: 'white', backgroundColor: "lightblue" }}>
            <h1>Ξ{Number(snapshot.totalEthValue).toFixed(2)}</h1>
          </div>
        </div>
      )}
    </TimelineContext.Consumer>
  );
}
