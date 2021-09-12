import { Injectable } from '@nestjs/common';
import timeline from "./timeline.json";
import blacklist from "./blacklist.json";
import superagent from 'superagent';
import Bottleneck from "bottleneck";
import customMapping from "./customMapping.json";
import addresses from "./addresses.json";
import BigNumber from "bignumber.js";
import fs from "fs";
import { InfluxDB } from '@influxdata/influxdb-client';
import { Point } from '@influxdata/influxdb-client';
const org = 'gv'
const bucket = 'metrics'

const limiter = new Bottleneck({
  minTime: 500,
  maxConcurrent: 1,
});

export type TTimelineEntry = {
  time: number,
  data: {
    amount: number | string;
    priceUSD: number | string;
    valueUSD: number | string;
    valueETH: number | string;
  }
}
export type TTimeline = {
  [key: string]: TTimelineEntry[]
}

export type TSnapshot = {
  totalEthValue: number;
  totalUSDValue: number
}

const pathToTimeline = './timeline.json';
const getAddressInfo = limiter.wrap((address, key) => superagent.get(`https://api.ethplorer.io/getAddressInfo/${address}?apiKey=${key}`).catch(console.log));
const getTokenInfo = limiter.wrap((tokenAddress, key) => superagent.get(`https://api.ethplorer.io/getTokenInfo/${tokenAddress}?apiKey=${key}`).catch(console.log));

@Injectable()
export class AppService {
  priceInterval: NodeJS.Timeout;
  writeInterval: NodeJS.Timeout;
  timeline: TTimeline;
  key: string;
  influxKey: string;
  influxClient: InfluxDB;

  constructor() {
    this.timeline = timeline as TTimeline;
    this.key = process.env.API_KEY;
    this.influxKey = process.env.INFLUX_DB_KEY;
    this.influxClient = new InfluxDB({ url: 'http://localhost:8086', token: this.influxKey });

    this.getPriceLoop();
    this.getPriceLoop = this.getPriceLoop.bind(this);
    this.writeLoop = this.writeLoop.bind(this);
    this.priceInterval = setInterval(this.getPriceLoop, 1 * 60 * 60 * 1000);
    this.writeInterval = setInterval(this.writeLoop, 1 * 60 * 60 * 1000);
  }

  async writeLoop() {
    console.log('writing to timeline');
    fs.writeFileSync(pathToTimeline, JSON.stringify(this.timeline));
    console.log('writing to timeline... done');
  }
  async getPriceLoop () {
    let newTimeline = this.timeline;
    const allTokens = {
      ETH: {
        amount: 0,
        priceUSD: 0,
        valueUSD: 0,
        valueETH: 0,
        timestamp: 0,
      }
    };

    await Promise.all(addresses.map(async (address) => {
      console.log('getting addressInfo');
      const response = await getAddressInfo(address, this.key);
      if(!response){
        return Promise.resolve();
      }
      console.log('getting addressInfo...done');
      const timestamp = Date.now();
      const { ETH: { balance: ethBalance, price: { rate } }, tokens } = response.body;
      const ethPrice = new BigNumber(rate);
      allTokens.ETH.amount += ethBalance;
      allTokens.ETH.priceUSD = ethPrice.toNumber();
      allTokens.ETH.valueUSD = allTokens.ETH.amount * ethPrice.toNumber();
      allTokens.ETH.valueETH = allTokens.ETH.amount;
      allTokens.ETH.timestamp = timestamp;
      if (tokens) {
        await Promise.all(tokens.map(async token => {
          const balance = (new BigNumber(token.rawBalance)).div(Math.pow(10, Number(token.tokenInfo.decimals)));
          const symbol = token.tokenInfo.symbol;
          if (balance.gt(new BigNumber("0.1")) && blacklist.indexOf(symbol) < 0) {
            const tokenInMap = allTokens[symbol];
            let priceUSD = new BigNumber(token.tokenInfo.price.rate);
            if(customMapping[symbol]){
              const customTokenInfo = await getTokenInfo(customMapping[symbol], this.key);
              if(!customTokenInfo){
                return Promise.resolve();
              }
              priceUSD = new BigNumber(customTokenInfo.body.price.rate);
            }
            
            const priceETH = ((priceUSD.multipliedBy(balance)).div(ethPrice)).div(balance);
            allTokens[symbol] = {
              ...allTokens[symbol],
              priceUSD: Number(priceUSD).toFixed(2),
              valueUSD: balance.multipliedBy(priceUSD).toFixed(2),
              valueETH: balance.multipliedBy(priceETH).toFixed(3),
              amount: (new BigNumber(balance)).plus(tokenInMap ? tokenInMap.amount : 0).toNumber().toFixed(3),
              timestamp
            }
          }
        }));
      }
    }));
    await Promise.all(Object.keys(allTokens).map(async symbol => {
      
      const writeApi = this.influxClient.getWriteApi(org, bucket)
      writeApi.useDefaultTags({ host: 'host1' })
      const token = allTokens[symbol];
      const usdValuePoint = new Point(symbol).floatField('value_usd', token.valueUSD).timestamp(new Date(token.timestamp));
      const ethValuePoint = new Point(symbol).floatField('value_eth', token.valueETH).timestamp(new Date(token.timestamp));
      const usdPricePoint = new Point(symbol).floatField('price_usd', token.priceUSD).timestamp(new Date(token.timestamp));
      try {
        writeApi.writePoints([
          usdValuePoint,
          ethValuePoint,
          usdPricePoint,
        ]);
        await writeApi.close();
        console.log('FINISHED')
      } catch (e) {
        console.error(e);
        console.log('\\nFinished ERROR');
      }
      
      newTimeline[symbol] = [...(newTimeline[symbol] || []), {time: token.timestamp, data: {amount: token.amount, priceUSD: token.priceUSD, valueUSD: token.valueUSD, valueETH: token.valueETH}}]
    }));
    console.log('adding to timeline');
    this.timeline = newTimeline;
    console.log('adding to timeline... done');
  }

  getTimeline(from: number = 0): TTimeline {
    const results = timeline as TTimeline;
    const filtered = Object.keys(results).reduce((reduction, symbol) => ({
      ...reduction,
      [symbol]: reduction[symbol].filter(entry => entry.time > Date.now() - from)
    }), results)
    return filtered;
  }
  
  getBlacklist(): string[] {
    const results = blacklist as string[];
    return results
  }

  getSnapshot(): TSnapshot {
    const totalEthValue = Object.keys(timeline).reduce((total, symbol) => total + Number(timeline[symbol][timeline[symbol].length -1].data.valueETH), 0);
    const totalUSDValue = Object.keys(timeline).reduce((total, symbol) => total + Number(timeline[symbol][timeline[symbol].length -1].data.valueUSD), 0);
    return {
      totalEthValue,
      totalUSDValue
    };
  }

}
