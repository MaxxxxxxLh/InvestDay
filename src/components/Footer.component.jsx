import React from "react";
import footerStyles from "../styles/Footer.module.css";
import Partners from "./Partners.component";

export default function Footer() {
  return (
    <div className={footerStyles.container}>
      <Partners />
      <span>
        Données fournies par{" "}
        <a
          href="https://financialmodelingprep.com/developer/docs/"
          target="_blank"
          rel="noreferrer"
        >
          Financial Modeling Prep
        </a>{" "}
      </span>
      <span>
        {" "}
        <a
          href="https://discord.gg/smw2CSHvCW"
          target="_blank"
          rel="noreferrer"
        >
          Notre Linktree
        </a>{" "}
      </span>
    </div>
  );
}
