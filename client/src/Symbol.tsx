import { Line } from "react-chartjs-2";
import 'chartjs-adapter-luxon';
import { TimelineContext, TTimlineDataPoint } from "./TimelineContext";

type SympolProps = {
  symbol: string,
  usdFn?: (x: TTimlineDataPoint) => number
  ethFn?: (x: TTimlineDataPoint) => number
}

export default function Symbol({
  symbol,
  usdFn = (x) => Number(x.data.valueUSD),
  ethFn = (x) => Number(x.data.valueETH)
}: SympolProps) {

  return (
    <TimelineContext.Consumer>
      {({ timeline, blacklist }) => {
        if (blacklist.includes(symbol)) {
          return null;
        }
        const dataPoints = timeline[symbol] || [];

        return (
          <div key={symbol} style={{ flex: 1, maxWidth: "40%", minWidth: "40%", marginRight: '2%', marginLeft: '2%' }}>
            <h1 style={{ textAlign: "center" }}>{symbol}</h1>
            <Line data={{
              labels: dataPoints.map((x) => {
                return x.time;
              }),
              datasets: [
                {
                  label: "Value ETH",
                  data: dataPoints.map(ethFn),
                  fill: false,
                  backgroundColor: "rgb(132, 99, 255)",
                  borderColor: "rgba(132, 99, 255, 0.5)",
                  cubicInterpolationMode: 'monotone',
                  tension: 0.4,
                  yAxisID: 'y-axis-1',
                },
                {
                  label: "USD Value",
                  data: dataPoints.map(usdFn),
                  fill: false,
                  backgroundColor: "rgb(132, 126, 99)",
                  borderColor: "rgba(132, 126, 99, 0.5)",
                  cubicInterpolationMode: 'monotone',
                  tension: 0.4,
                  yAxisID: 'y-axis-2',
                },
              ]
            }}
              options={{
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                responsive: true,
                scales: {
                  yAxes: [
                    {
                      type: 'linear',
                      id: 'y-axis-1',
                    },
                    {
                      type: 'linear',
                      id: 'y-axis-2',
                    },
                  ],
                  x: {
                    type: 'time',
                    time: {
                      // Luxon format string
                      tooltipFormat: 'DD T'
                    },
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  },
                },
                elements: {
                  point: {
                    radius: 0
                  }
                }
              }} />
          </div>
        );
      }}
    </TimelineContext.Consumer>

  );
}