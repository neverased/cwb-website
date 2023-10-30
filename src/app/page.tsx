"use client";

import Image from "next/image";
import styles from "./page.module.css";
import CodeBlock from "@/components/highligt_code";
import { WELCOME, CONTACT, COOKIES, HACKING } from "@/static/staticText/start";
import { Intro } from "@/components/use_scramble";

export default function Home() {
    return (
        <main className={styles.main}>
            <Intro texts={HACKING} />

            {/* <div className={styles.grid}>{CodeBlock(WELCOME, "javascript")}</div>
      <div className={styles.grid}>
        {CodeBlock(
          `import Logo from "./public/assets/cwb_logo.png`,
          "javascript"
        )}
      </div>
      <div className={styles.grid}>
        <Image
          className={styles.logo}
          src="/wbc_logo_alpha_kolor_neg.png"
          alt="CWB Logo"
          width={350}
          height={70}
          priority
        />
      </div>
      <div className={styles.grid}>{CodeBlock(CONTACT, "javascript")}</div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>
      </div>
      <div className={styles.grid}>{CodeBlock(COOKIES, "powershell")}</div> */}
        </main>
    );
}
