import Logo from "./Logo";
import { LinkButton } from "./Button";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-6">
          <a href="#how" data-cursor="hover" className="hidden text-[14px] text-muted transition-colors hover:text-text sm:block">
            How it works
          </a>
          <a href="#example" data-cursor="hover" className="hidden text-[14px] text-muted transition-colors hover:text-text sm:block">
            Example
          </a>
          <LinkButton href="/studio" variant="ghost" size="sm">
            Studio
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
