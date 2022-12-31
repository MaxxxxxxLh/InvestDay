import Head from "next/head";
import { Inter } from "@next/font/google";
import homeStyles from "../../styles/Home.module.css";
import marketStyles from "../../styles/Market.module.css";
import InfoBox from "../../components/InfoBox.component.jsx";
import TableSearch from "../../components/TableSearch.component.jsx";
import DashBoardLayout from "../../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

export default function detailAction() {
  const router = useRouter();
  const actionName = router.query.nameAction;
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
          <h1>Informations : {actionName}</h1>
          <p>Graphique {actionName}</p>
        </div>
      </main>
    </>
  );
}

detailAction.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};
