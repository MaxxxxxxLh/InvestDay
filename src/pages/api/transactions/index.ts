import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiResponse } from "next";
import requestIp from "request-ip";
import { Request } from "../../../types/request.type";
import { Status } from "@prisma/client";
import stockService from "../../../services/stocks/stocks.service";
import transactionsService from "../../../services/transactions/transactions.service";
import walletsService from "../../../services/wallets/wallets.service";
// listen for get request
export default apiHandler(transactionByWallet);

function isMarketOpenNow(openingTime: string, closingTime: string): boolean {
  const currentDateTime: Date = new Date();
  const openingDateTime: Date = parseTime(openingTime);
  const closingDateTime: Date = parseTime(closingTime);

  return currentDateTime >= openingDateTime && currentDateTime <= closingDateTime;
}

function parseTime(time: string): Date {
  const hour: number = parseInt(time.split(":")[0]);
  const minute: number = parseInt(time.split(":")[1].split(" ")[0]);
  const ampm: string = time.split(" ")[1];
  const dateTime: Date = new Date();

  dateTime.setHours(hour + (ampm === "p.m." && hour !== 12 ? 12 : 0));
  dateTime.setMinutes(minute);

  return dateTime;
}


async function transactionByWallet(req: Request, res: NextApiResponse<any>) {
  //desactivate temporarly this endpoint

  if (req.method !== "POST") {
    throw `Method ${req.method} not allowed`;
  }
  const { amount, executed, adminPrice, walletId, symbol, selling } = req.body;

  if (!walletId) throw "Wallet id is required";

  const wallet = await walletsService.find(walletId, true);

  if (!wallet) throw "Wallet not found";
  if (wallet?.userId !== req.auth.sub && !req.auth.isAdmin)
    throw "You are not allowed to access this wallet";
  if (adminPrice && !req.auth.isAdmin)
    throw "You are not allowed to set admin price";
  if (!amount || (!adminPrice && !symbol))
    throw "Please provide amount and stockId or adminPrice";
  if (executed && !req.auth.isAdmin)
    throw "You are not allowed to force execute transaction";

  if (amount <= 0) throw "Amount must be greater than 0";

  if (adminPrice) {
    return res
      .status(200)
      .json(
        await walletsService.addMoney(
          walletId,
          parseFloat(adminPrice) * parseFloat(amount)
        )
      );
  }

  // Get last stock price
  const clientIp = requestIp.getClientIp(req);

  if (!clientIp) throw new Error("No client IP found");
  const summary: any = await stockService.getLastPrice(
    symbol,
    req.auth.sub,
    clientIp || ""
  );
  console.log("summary "+summary)
  if (summary?.companiesPriceList[0]?.error == "NOT_FOUND") {
    throw "Unknown symbol";
  }
  let stock: any = summary.companiesPriceList[0];
  const resultData: any = await stockService.getDetailsStock(
    symbol,
    req.auth.sub,
    clientIp || "",
  )
  try{const openMarketHours: any = await stockService.getOpenMarketHours(
    symbol,
    req.auth.sub,
    clientIp || "",
  )
  console.log("Open hours")
  console.log(openMarketHours)
}catch(e){
  console.log("error market hours")
}
  
  
  if (!wallet.id) throw new Error("Wallet not found");
  const transaction = await transactionsService.create(
    selling === "true",
    symbol,
    Number(parseFloat(amount).toFixed(1)),
    wallet.id as number
  );
  console.log("transaction "+transaction)
  /*if (
   isMarketOpenNow(openMarketHours.stockMarketHours.openingHour,openMarketHours.stockMarketHours.closingHour)
  ) {*/
    if (selling === "true") {
      let quantity = 0;
      wallet.transactions.forEach((transaction: any) => {
        if (
          transaction.symbol === symbol &&
          transaction.status === "EXECUTED"
        ) {
          quantity += (transaction.isSellOrder ? -1 : 1) * transaction.quantity;
        }
      });
      if (quantity < parseFloat(amount)) {
        await transactionsService.updateStatus(transaction.id, Status.FAILED);
      } else {
        await transactionsService.executeTransaction(transaction, stock.price);
      }
    } else {
      if (wallet.cash < stock.price * parseFloat(amount)) {
        await transactionsService.updateStatus(transaction.id, Status.FAILED);
      } else {
        await transactionsService.executeTransaction(transaction, stock.price);
      }
    }
  //}

  // get new wallet
  const newWallet = await walletsService.find(walletId);

  return res.status(200).json(newWallet);
}
