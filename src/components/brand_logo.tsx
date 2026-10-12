import styles from "./brand_logo.module.css";

interface BrandLogoProps {
  className?: string;
  compactOnMobile?: boolean;
  tone?: "dark" | "light";
}

export const BrandLogo = ({
  className = "",
  compactOnMobile = false,
  tone = "dark",
}: BrandLogoProps) => (
  <picture
    className={`${styles.logo} ${compactOnMobile ? styles.responsive : ""} ${className}`}
  >
    <source media="print" srcSet="/brand/logo-on-light.png" />
    {compactOnMobile && (
      <source media="screen and (max-width: 720px)" srcSet="/brand/mark.png" />
    )}
    <img
      src={`/brand/logo-on-${tone}.png`}
      alt="Consulting Wojciech Bajer"
      width={3217}
      height={405}
      decoding="async"
    />
  </picture>
);
