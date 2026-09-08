import Image from "next/image";

import { selectedCollaborations } from "@/static/siteContent";

import styles from "./selected_work.module.css";

export const SelectedWork = () => (
  <section id="work" className={styles.work} aria-labelledby="work-title">
    <div className={styles.heading}>
      <h2 id="work-title" className="eyebrow">
        Selected collaborations
      </h2>
      <p>Across multimedia, engineering and delivery.</p>
    </div>
    <ul className={styles.logos}>
      {selectedCollaborations.map(({ name, src, width, height, surface }) => (
        <li
          key={name}
          className={
            surface === "light" || surface === "yellow"
              ? styles.lightLogo
              : undefined
          }
        >
          <Image
            src={src}
            alt={name}
            width={width}
            height={height}
            sizes="(max-width: 720px) 100px, 140px"
          />
        </li>
      ))}
    </ul>
  </section>
);
