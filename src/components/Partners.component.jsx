import React from "react";
import Link from "next/link";
import partnersStyles from "../styles/Partners.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import vfinance from "src/public/assets/partners/3vfinance.svg";

export default function Partners() {
  const router = useRouter();
  return (
    <div className={partnersStyles.container}>
      <Link href="https://www.3vfinance.com/">
        <Image src={vfinance} alt="3VFinance" className={partnersStyles.image} />
      </Link>
    </div>
  );
}
