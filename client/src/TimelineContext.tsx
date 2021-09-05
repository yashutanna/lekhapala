import axios from "axios";
import React, { useEffect, useState } from "react";

export type TTimlineData = {
  amount: number | string;
  priceUSD: number | string;
  valueUSD: number | string;
  valueETH: number | string;
}

export type TTimlineDataPoint = {
  time: number,
  data: TTimlineData
}

export interface TTimeline {
  [symbol: string]: TTimlineDataPoint[]
}

export interface TSnapshot {totalUSDValue: number | string , totalEthValue: number | string  }

export const TimelineContext = React.createContext({ loading: true, timeline: {} as TTimeline, blacklist: [] as string[], snapshot: {} as TSnapshot});

const TimelineContextProvider: React.FunctionComponent = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timeline, setTimeline] = useState<TTimeline>({});
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [snapshot, setSnapshot] = useState({
    totalEthValue: 'loading',
    totalUSDValue: 'loading'
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data: timeline } = await axios.get('http://raspberrypi.local:3001');
      const { data: blacklist } = await axios.get('http://raspberrypi.local:3001/blacklist');
      const { data: snapshot  } = await axios.get('http://raspberrypi.local:3001/snapshot');
      setTimeline(timeline);
      setBlacklist(blacklist);
      setSnapshot(snapshot);
      setLoading(false);
    };
    getData();
    const interval = setInterval(getData, 60000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <TimelineContext.Provider value={{ timeline, blacklist, snapshot, loading }} >
        {children}
    </TimelineContext.Provider>
  )
};

export default TimelineContextProvider;