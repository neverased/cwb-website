import Image from "next/image";

import { selectedCollaborations } from "@/static/siteContent";

import styles from "./selected_work.module.css";

const logoPresentation: Record<
  (typeof selectedCollaborations)[number]["name"],
  { className: string; width?: number; height?: number }
> = {
  Dolby: { className: styles.dolby },
  Polestar: { className: styles.polestar },
  Volvo: { className: styles.volvo },
  DHL: { className: styles.dhl },
  "Leroy Merlin": { className: styles.leroyMerlin, width: 176, height: 106 },
  Budimex: { className: styles.budimex, width: 5017, height: 1152 },
  TDJ: { className: styles.tdj },
  Lexense: { className: styles.lexense },
  PTTK: { className: styles.pttk },
};

// Keep each supplied mark on its intended surface without recoloring it.
const logoRows = [
  selectedCollaborations.filter(({ surface }) => surface === "dark"),
  selectedCollaborations.filter(({ surface }) => surface !== "dark"),
];

export const SelectedWork = () => (
  <section id="work" className={styles.work} aria-labelledby="work-title">
    <div className={styles.heading}>
      <h2 id="work-title" className="eyebrow">
        Selected collaborations
      </h2>
      <p>Across multimedia, engineering and delivery.</p>
    </div>
    <div className={styles.logoRows}>
      {logoRows.map((logos, index) => (
        <ul
          key={index === 0 ? "dark" : "light"}
          className={`${styles.logos} ${index === 1 ? styles.lightRow : styles.darkRow}`}
          role="list"
        >
          {logos.map(({ name, src, width, height }) => {
            const presentation = logoPresentation[name];

            return (
              <li key={name} className={presentation.className}>
                <Image
                  src={src}
                  alt={name}
                  width={presentation.width ?? width}
                  height={presentation.height ?? height}
                  sizes="(max-width: 480px) 105px, 150px"
                />
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  </section>
);
