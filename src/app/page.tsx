"use client";

import Image from "next/image";

import { TerminalLoader } from "@/components/use_scramble";
import { HACKING } from "@/static/staticText/start";

import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.terminalColumn}>
                    <div className={styles.copyBlock}>
                        <p className={styles.eyebrow}>Initial screen</p>
                        <h1 className={styles.title}>A live terminal boot sequence, not a static splash screen.</h1>
                        <p className={styles.description}>
                            The left side now behaves like a loading surface that wakes the site up before the brand
                            locks in. The right side keeps the logo isolated and visible instead of burying it below
                            the intro.
                        </p>
                    </div>

                    <TerminalLoader texts={HACKING} />
                </div>

                <aside className={styles.brandColumn}>
                    <div className={styles.brandCard}>
                        <p className={styles.brandLabel}>Consulting Wojciech Bajer</p>

                        <div className={styles.logoFrame}>
                            <Image
                                className={styles.logo}
                                src="/wbc_logo_alpha_kolor_neg.png"
                                alt="CWB Logo"
                                width={3667}
                                height={700}
                                priority
                            />
                        </div>

                        <p className={styles.brandText}>
                            Creative engineering, digital direction, and systems built with a sharper signal.
                        </p>

                        <div className={styles.signalRow}>
                            <span className={styles.signalChip}>Brand systems</span>
                            <span className={styles.signalChip}>Product thinking</span>
                            <span className={styles.signalChip}>Technical execution</span>
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
}
