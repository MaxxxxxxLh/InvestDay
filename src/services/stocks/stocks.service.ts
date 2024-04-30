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
        stockExchange: stock.stockExchange,
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
  minute = "1min" as any,
  minute_5 = "5min" as any,
  minute_15 = "15min" as any,
  minute_30 = "30min" as any,
  hour_1 = "1hour" as any,
  hour_4 = "4hour" as any,
}

async function getRecentPrices(
  symbol: string,
  time: times = times.minute,
  userId: number,
  ip: string,
): Promise<any[]> {
  let url = "";
  let today = new Date();
  let daybegining = new Date();
  daybegining.setDate(today.getDate() - 2 * 365);
  let formatedToday: string = formatDate(today);
  let formatedBeginingDate: string = formatDate(daybegining);
  
  function formatDate(date: Date): string {
    let year: number = date.getFullYear();
    let day: string | number = date.getDate();
    let month: string | number = date.getMonth() + 1;
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    return `${year}-${day}-${month}`;
  }
  url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${API_FINANCIAL_KEY}`//`https://financialmodelingprep.com/api/v3/historical-chart/${time}/${symbol}?from=${formatedBeginingDate}&to=${formatedToday}&apikey=${API_FINANCIAL_KEY}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();
  return data.historical;
}

async function getDetailsStock(
  symbol: string,
  userId: number,
  ip: string
): Promise<any[]> {

  let url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${API_FINANCIAL_KEY}`

  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();
  console.log("detail stock service "+data)
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
