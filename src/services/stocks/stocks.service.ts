import { Dictionary } from "highcharts";
import { StockApi } from "../../types/stockapi.type";
const { API_KEY } = process.env;
const { API_POLYGON_KEY } = process.env;
const { API_FINANCIAL_KEY } = process.env;

async function search(
  query: String,
  userId: number,
  ip: string
): Promise<StockApi[]> {
  const url = `https://financialmodelingprep.com/api/v3/search?query=${query}&apikey=${API_FINANCIAL_KEY}`; 
  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });
  const data = await response.json();
  console.log(data)
  const matches: StockApi[] = [];
  for (let stock of data) {
    if (stock.currency && stock.currency.toUpperCase() === "USD") {
        matches.push({
        symbol: stock.symbol,
        name: stock.name,
        currency: stock.currency,
      });
    }
  }
  console.log(matches);
  return matches;
}

function createHeader(userId: string, ip: string) {
  // Headers required to use the Launchpad product.
  const edgeHeaders = {
    // X-Polygon-Edge-ID is a required Launchpad header. It identifies the Edge User requesting data.
    "X-Polygon-Edge-ID": `${userId}`,
    // X-Polygon-Edge-IP-Address is a required Launchpad header. It denotes the originating IP Address of the Edge User requesting data.
    "X-Polygon-Edge-IP-Address": `${ip}`,
    // X-Polygon-Edge-User-Agent is an optional Launchpad header. It denotes the originating UserAgent of the Edge User requesting data.
    "X-Polygon-Edge-User-Agent": "*",
  };

  return edgeHeaders;
}


async function getRecentPrices(
  symbol: string,
  userId: number,
  ip: string,
): Promise<any[]> {
  let url = "";
  url = `https://financialmodelingprep.com/api/v3/stock/real-time-price?apikey=${API_FINANCIAL_KEY}`;
  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();

  return data.stockList.find((stock: { [x: string]: string; })=>stock['symbol']=symbol).price;
}

async function getDetailsStock(
  symbol: string,
  userId: number,
  ip: string
): Promise<any[]> {
  let url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_FINANCIAL_KEY}`

  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();

  return data;
}

async function getLogoStock(
  symbol: string,
  userId: number,
  ip: string  
): Promise<any> {
  let url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_FINANCIAL_KEY}`;

  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();

  return data[0]["image"];
}

async function getLastPrice(
  userId: number,
  ip: string
): Promise<any[]> {
  let url = `https://financialmodelingprep.com/api/v3/stock/real-time-price?apikey=${API_FINANCIAL_KEY}`;
  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();

  return data;
}

const stocksService = {
  search,
  getRecentPrices,
  getDetailsStock,
  getLastPrice,
  getLogoStock,
};
export default stocksService;
