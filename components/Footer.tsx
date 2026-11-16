import Logo from "./Logo";
import { AUTHORS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-[13px] text-muted">from Kazakh «киім» — clothing</span>
        </div>
        {/* <p className="text-[13px] text-muted">
          Made by <span className="text-text">{AUTHORS.join(" & ")}</span> for Higgsfield Soul Camp
        </p> */}
      </div>
    </footer>
  );
}
