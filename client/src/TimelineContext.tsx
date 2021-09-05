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

export const TimelineContext = React.createContext({ loading: true, timeline: {} as TTimeline, blacklist: [] as string[], snapshot: {} as TSnapshot, setFrom: (number: number) => {} });

export const second = 1000;
export const minute = second * 60;
export const hour = minute * 60;
export const day = hour * 24;

const TimelineContextProvider: React.FunctionComponent = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timeline, setTimeline] = useState<TTimeline>({});
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [from, setFrom] = useState<number>(1 * day);
  const [snapshot, setSnapshot] = useState({
    totalEthValue: 'loading',
    totalUSDValue: 'loading'
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data: timeline } = await axios.get(`http://raspberrypi.local:3001?from=${from}`);
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
  }, [from]);

  return (
    <TimelineContext.Provider value={{ timeline, blacklist, snapshot, loading, setFrom }} >
        {children}
    </TimelineContext.Provider>
  )
};

export default TimelineContextProvider;