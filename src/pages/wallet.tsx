import Head from "next/head";

import { Inter } from "@next/font/google";
import homeStyles from "../styles/Home.module.css";

import Button from "../components/Button.component";
import InfoBox from "../components/InfoBox.component.jsx";
import TableWallet from "../components/TableWallet.component.jsx";
// import NavBar from "./NavBar.jsx/index.js.js.js";
import { useFetch } from "../context/FetchContext.js";

import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import wallet from "src/public/assets/wallet.svg";
import cash from "src/public/assets/cash.svg";
import total from "src/public/assets/total.svg";

const inter = Inter({ subsets: ["latin"] });

export default function Wallet() {
  const router = useRouter();

  const [selectedId, setSelectedId] = useState(0);
  const [cashWallet, setCash] = useState(0);
  const [assets, setAssets] = useState(0);

  const [wallets, setWallets] = useState();
  const fetch = useFetch();

  async function getPrice(symbol: string) {
    try {
      const response = await fetch.get("/api/stock/lastPrice?symbol=" + symbol);

      return response;
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    if (wallets) {
      if (wallets.length === 0) {
        setCash(0);
        setAssets(0);
        return;
      }
      setCash(calculateCash());
      calculateAssets().then((assets) => {
        setAssets(assets);
      });
    } else {
      refreshWallets();
    }
  }, [wallets, selectedId]);

  function calculateCash() {
    let cash = 0;
    // cash is equal to the sum of all the transactions.isAdmin minus the sum of all the transactions.isSellOrder * valueAtExecution * quantity plus the sum of all the transactions.isSellOrder true * valueAtExecution * quantity
    wallets[selectedId].transactions.forEach((transaction: any) => {
      if (transaction.isAdmin && !transaction.isSellOrder) {
        // if it's cash
        cash += transaction.valueAtExecution * transaction.quantity;
      } else if (transaction.isAdmin && transaction.isSellOrder) {
        cash -= transaction.valueAtExecution * transaction.quantity;
      } else {
        if (transaction.isSellOrder) {
          // if it's sold
          cash += transaction.valueAtExecution * transaction.quantity;
        } else {
          // if it's a stock and isn't sold
          cash -= transaction.valueAtExecution * transaction.quantity;
        }
      }
    });
    return cash;
  }
  // assets is equal to the sum of all the transactions.isSellOrder false * valueAtExecution * quantity
  async function calculateAssets() {
    let asset = 0;
    await wallets[selectedId].transactions.forEach((transaction: any) => {
      if (!transaction.isAdmin) {
        if (!transaction.isSellOrder) {
          console.log(transaction);
          getPrice(transaction.symbol).then((price) => {
            // if it's a stock and isn't sold
            asset += price * transaction.quantity;
            setAssets(asset);
          });
        }
      }
    });
    return asset;
  }
  async function handleNewWallet() {
    console.log("new wallet");
    const newWallet = await fetch.get("/api/wallet/new");
    refreshWallets();
  }

  async function refreshWallets() {
    const userWallets = await fetch.get("/api/wallet");
    console.log(userWallets);
    setWallets(() => userWallets);
    return userWallets;
  }

  return (
    <>
      <Head>
        <title>InvestTrade - Portefeuille</title>
        <meta name="description" content="Portefeuille" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.pageContainer}>
        <div className={homeStyles.headerContainer}>
          <div className={homeStyles.titleContainer}>
            <h1>Portefeuille</h1>
            {wallets &&
              wallets.map((wallet, index) => (
                <Button
                  key={index}
                  title={`${index + 1}`}
                  selected={selectedId === index}
                  onClick={() => {
                    setSelectedId(index);
                  }}
                />
              ))}
            {wallets && wallets.length < 3 && (
              <Button title={"+"} onClick={() => handleNewWallet()} />
            )}
          </div>
          <Button
            title={"Chercher une action"}
            onClick={() => {
              router.push("/market");
            }}
          />
        </div>
        <div className={homeStyles.contentContainer}>
          <div className={homeStyles.infoBoxContainer}>
            <InfoBox
              title={`Valeur de vos actions portefeuille n°${selectedId + 1}`}
              desc={wallets ? assets.toFixed(2) + " $" : "$"}
              icon={wallet}
            />
            <InfoBox
              title={`Cash portefeuille n°${selectedId + 1}`}
              desc={wallets ? cashWallet.toFixed(2) + " $" : "$"}
              icon={cash}
            />
            <InfoBox
              title={`Valeur totale portefeuille n°${selectedId + 1}`}
              desc={wallets ? (cashWallet + assets).toFixed(2) + " $" : "$"}
              icon={total}
            />
          </div>
          <div className={homeStyles.tableContainer}>
            {wallets && wallets[selectedId]?.transactions && (
              <TableWallet
                activeWalletTransactions={wallets[selectedId]?.transactions}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

Wallet.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};
