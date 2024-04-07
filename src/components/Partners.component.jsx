import React from "react";
import Link from "next/link";
import partnersStyles from "../styles/Partners.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import alttrading from "src/public/assets/partners/alttrading.png";
import polygon from "src/public/assets/partners/polygon.svg";
import vantage from "src/public/assets/partners/vantage.png";

export default function Partners() {
  const router = useRouter();
  return (
    <div className={partnersStyles.container}>
    </div>
  );
}
