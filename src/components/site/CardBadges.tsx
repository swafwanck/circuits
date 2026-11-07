import { Sparkles } from "lucide-react";

export function computeSavePct(price?: number, offer?: number) {
  if (!price || !offer || offer >= price) return null;
  return Math.round(((price - offer) / price) * 100);
}

type Props = {
  savePct?: number | null;
  bestseller?: boolean;
  instant?: boolean;
  className?: string;
};

export function CardBadges({ savePct, className = "" }: Props) {
  if (!savePct) return null;
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      <span className="inline-flex items-center gap-0.5 rounded-full bg-sunset-gradient px-2 py-0.5 text-[9px] font-bold text-white shadow-glow">
        <Sparkles className="h-2.5 w-2.5" /> Save {savePct}%
      </span>
    </div>
  );
}
