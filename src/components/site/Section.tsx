import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`${
        align === "center"
          ? "text-center max-w-2xl mx-auto"
          : "max-w-2xl"
      } ${className}`}
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-sunset/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
          {eyebrow}
        </span>
      )}

      <h2
        className={`mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground ${titleClassName}`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-3 text-base md:text-lg text-muted-foreground ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}