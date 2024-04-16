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

import wallet from "src/public/assets/wallet.svg";
import cash from "src/public/assets/cash.svg";
import total from "src/public/assets/total.svg";
import { useFetch } from "../context/FetchContext";
import { useWallet } from "../context/WalletContext";

import Link from 'next/link';

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
  
  return (
    <>
      <Head>
        <title>InvestTrade</title>
        <meta name="description" content="Page d'accueil" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.pageContainer}>

          <div className={homeStyles.homePageTitleContainer}>
            <h1>InvestTrade</h1>
          </div>

        <div className={homeStyles.contentContainer}>
            <div className={homeStyles.centeredTextContainerJustified}>
            <p>Bienvenue sur la deuxième édition du concours d&apos;investissement d&apos;IsepInvest !</p>
            </div>
            <div className={homeStyles.centeredTextContainer}>
          <p>Vous commencez avec jusqu&apos;à 4 portefeuilles de 10000€. Le but ? Faire le plus de profit possible. 
          <br/>Cette année, vous avez libre choix entre la bourse européenne, américaine, et même les cryptos ! </p>
          <br/>
          <p>Tu ne sais pas par ou commencer ? Jette un coup d&apos;oeil aux actions sur le <Link href="/market">marché</Link>. </p>
          <p>Rejoins le <Link href="https://discord.gg/invite/A2EYJBsycU">Discord</Link> pour discuter finance !</p>
          </div>

          <div className={homeStyles.tableContainer}>
          </div>

        </div>
      </main>
    </>
  );
}

Home.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};