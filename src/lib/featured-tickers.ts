export type FeaturedTicker = {
  ticker: string;
  name: string;
  logoBg: string;
  investDate: string;
  volume: string;
};

export const featuredTickers: FeaturedTicker[] = [
  { ticker: "AAPL", name: "Apple Inc", logoBg: "#12121a", investDate: "Feb 22, 2024", volume: "7.10B" },
  { ticker: "GOOGL", name: "Alphabet Inc", logoBg: "#ffffff", investDate: "Feb 10, 2024", volume: "5.40B" },
  { ticker: "MSFT", name: "Microsoft Corp", logoBg: "#00a4ef", investDate: "Feb 17, 2024", volume: "3.20B" },
  { ticker: "SPOT", name: "Spotify Technology SA", logoBg: "#1db954", investDate: "Jan 28, 2024", volume: "1.80B" },
  { ticker: "AMZN", name: "Amazon.com Inc", logoBg: "#ff9900", investDate: "Mar 4, 2024", volume: "4.30B" },
  { ticker: "TSLA", name: "Tesla Inc", logoBg: "#e31937", investDate: "Mar 12, 2024", volume: "6.90B" },
  { ticker: "NVDA", name: "NVIDIA Corp", logoBg: "#76b900", investDate: "Apr 1, 2024", volume: "8.50B" },
  { ticker: "META", name: "Meta Platforms Inc", logoBg: "#0866ff", investDate: "Apr 15, 2024", volume: "2.60B" },
];
