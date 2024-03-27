import { Dictionary } from "highcharts";
import { StockApi } from "../../types/stockapi.type";
const { API_KEY } = process.env;
const { API_FINANCIAL_KEY } = process.env;

async function search(
  symbol: String,
  userId: number,
  ip: string
): Promise<StockApi[]> {
  const url = `https://financialmodelingprep.com/api/v3/search?query=${symbol}&apikey=${API_FINANCIAL_KEY}`; 
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

enum times {
  day = "1d" as any,
  week = "1w" as any,
  month = "1m" as any,
}

async function getRecentPrices(
  symbol: string,
  time: times = times.day,
  userId: number,
  ip: string,
): Promise<any[]> {
  let url = "";
  let today = new Date();
  let daybegining = new Date();
  daybegining.setDate(today.getDate() - 2 * 365);

  let formatedToday = today.toISOString().slice(0, 10);
  let formatedBeginingDate = daybegining.toISOString().slice(0, 10);
  url = `https://financialmodelingprep.com/api/v3/historical-chart/5min/${symbol}?from=${formatedBeginingDate}&to=${formatedToday}&apikey=${API_FINANCIAL_KEY}`;
  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();

  return data.companiesPriceList[0].price;
}

async function getDetailsStock(
  symbol: string,
  userId: number,
  ip: string
): Promise<any[]> {

  let url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?${API_FINANCIAL_KEY}`

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
  let url = `https://financialmodelingprep.com/image-stock/${symbol}.png`;

  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });
  
  const imagePng = await response.json();
  return imagePng
}

async function getLastPrice(
  symbol: string,
  userId: number,
  ip: string
): Promise<any[]> {
  let url = `https://financialmodelingprep.com/api/v3/stock/real-time-price/${symbol}?apikey=${API_FINANCIAL_KEY}`;
  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json(); 
  console.log(data.companiesPriceList[0].price)
  return data.companiesPriceList[0].price;
}

const stocksService = {
  search,
  getRecentPrices,
  getDetailsStock,
  getLastPrice,
  getLogoStock,
};
export default stocksService;
