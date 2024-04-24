import Head from "next/head";

import homeStyles from "../styles/Home.module.css";
import Button from "../components/Button.component";
import InfoBox from "../components/InfoBox.component.jsx";
import TableTransaction from "../components/TableTransaction.component.jsx";

import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Action, Status } from "../types/dataTransaction";

// Market
import TableSearch from "../components/TableSearch.component.jsx";
import marketStyles from "../../styles/Market.module.css";

import wallet from "src/public/assets/wallet.svg";
import wallet_image from "src/public/assets/wallet.svg";
import cash from "src/public/assets/cash.svg";
import total from "src/public/assets/total.svg";
import { useFetch } from "../context/FetchContext";
import { useWallet } from "../context/WalletContext";
type Data = {
  date: Date;
  companie: string;
  value: number;
  quantity: number;
  action: Action;
  status: Status;
};
export default function Home() {
  const router = useRouter();
  const {
    wallets,
    walletsLines,
    selectedId,
    selectWallet,
    assetsCached,
    actualiseWalletsLines,
  } = useWallet();
  useEffect(() => {
    if (wallets) {
      if (!(walletsLines && walletsLines[selectedId]))
        actualiseWalletsLines(selectedId);
    }
  }, [wallets, selectedId]);


// Partie market
// Ligne const retirée car redondante 33
const [data, setData] = useState([] as any);
const [input, setInput] = useState("");
const fetch = useFetch();
let tmpName;

const onChange = (e: any) => {
  tmpName = e.target.value;
  setInput(tmpName);
};

const handleKeyDown = (event: any) => {
  if (event.key === "Enter" && input !== null) {
    fetchSearch(input);
  }
};

function fetchSearch(symbol: string) {
  return fetch
    .get("/api/stock/search?term=" + symbol)
    .then((response) => {
      return response;
    })
    .then((data) => setData(data))
    .catch((error) => {
      console.log(error);
    });
}

let list = [];

//check if data is not undefined and not empty
if (typeof data !== "undefined" && data.length !== 0) {
  //console.log(data);
  //get data.symbol, data.name for each dictionnary of data
  for (let i = 0; i < data.length; i++) {
    //check if name contains "warrant" or "Warrant" or "WARRANT" or "Warrants" or "WARRANTS" or "warrants" anf if , then skip
    if (
      data[i]["name"] &&
      (data[i]["name"].includes("warrant") ||
        data[i]["name"].includes("Warrant") ||
        data[i]["name"].includes("WARRANT") ||
        data[i]["name"].includes("Warrants") ||
        data[i]["name"].includes("WARRANTS") ||
        data[i]["name"].includes("warrants"))
    ) {
      continue;
    }
    list.push({
      symbol: data[i]["symbol"],
      name: data[i]["name"],
      stockExchange: data[i]["stockExchange"],
    });
  }
}
// Partie Market
  
  return (
    <>
      <Head>
        <title>InvestTrade - Home</title>
        <meta name="description" content="Page d'accueil" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.pageContainer}>
        <div className={homeStyles.headerContainer}>
          <div className={homeStyles.titleContainer}>
            <h1>Marchés</h1>

            {wallets.map((wallet, index) => (
              <Button
                key={index}
                title={`${index + 1}`}
                selected={selectedId === index}
                onClick={() => selectWallet(index)}
              />
            ))}
          </div>
        </div>
        <div className={homeStyles.contentContainer}>
          <div className={homeStyles.infoBoxContainer}>
            <div className={homeStyles.searchInput}>
              <div className={homeStyles.formSubmit}>
                <input
                  className={homeStyles.formSubmit}
                  type="text"
                  placeholder="Rechercher..."
                  name="value"
                  value={input}
                  onChange={onChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <InfoBox
              title={`Valeur de vos actions portefeuille n°${selectedId + 1}`}
              desc={wallets ? assetsCached.toFixed(2) + " $" : "$"}
              icon={wallet}
            />
            <InfoBox
              title={`Cash portefeuille n°${selectedId + 1}`}
              desc={
                wallets ? wallets[selectedId]?.cash?.toFixed(2) + " $" : "$"
              }
              icon={cash}
            />
            <InfoBox
              title={`Valeur totale portefeuille n°${selectedId + 1}`}
              desc={
                wallets
                  ? ((wallets[selectedId]?.cash || 0) + assetsCached).toFixed(
                      2
                    ) + " $"
                  : "$"
              }
              icon={total}
            />
          </div>

          <div className={homeStyles.contentContainer}>
          <div className={homeStyles.tableContainer}>
            <TableSearch data={list} />
          </div>
        </div>

        </div>
      </main>
    </>
  );
}

Home.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};
