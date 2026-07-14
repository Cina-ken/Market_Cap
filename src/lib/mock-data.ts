export type TickerSnapshot = {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  logoBg: string;
};

export type HoldingRow = {
  ticker: string;
  name: string;
  investDate: string;
  volume: string;
  changePercent: number;
  price: number;
  logoBg: string;
};
