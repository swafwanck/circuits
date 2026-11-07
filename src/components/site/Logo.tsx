import { Link } from "@tanstack/react-router";
// import logoAsset from "../../../src/assets/circuit-logo.png.asset.json";
// import logo from "../../../src/assets/image/circuit-logo.png";
import logo from "../../../src/assets/image/logo_3.png";

export function Logo({ className = "" }: { className?: string; showText?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="Circuit Travels & Holidays LLC"
      className={`inline-block shrink-0 min-w-0 scale-[1.15] transition-transform duration-300 ${className}`}
    >
      <span className="inline-block shrink-0 transition-all
          duration-300 ">
        <img
          src={logo}
          alt="Circuit Travels & Holidays LLC"
          width={330}
          height={150}
          className="h-11 xs:h-11 sm:h-12 md:h-14 w-auto object-contain "
          style={{ imageRendering: "auto" }}
        />
      </span>
    </Link>
  );
}
