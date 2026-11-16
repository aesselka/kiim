import Reveal from "./Reveal";
import GlassCard from "./GlassCard";
import { LinkButton } from "./Button";
import { ArrowIcon } from "./icons";

const STEPS = [
  {
    n: "01",
    accent: "face",
    text: "A Soul ID trained once on a handful of selfies. Your face and proportions, in every photo.",
  },
  {
    n: "02",
    accent: "occasion",
    text: "Pick where you're going — or describe it in your own words. No prompts to write.",
  },
  {
    n: "03",
    accent: "looks",
    text: "Three looks — classic, bold, effortless — styled with notes and a palette, rendered on you.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-10 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <Reveal>
          <p className="label">How it works</p>
          <h2 className="display mt-4 max-w-[16ch] text-[clamp(38px,5.2vw,68px)]">
            From <span className="serif text-accent">“what do I wear?”</span> to three answers.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={0.08 * i}>
              <GlassCard as="section" className="flex h-full flex-col gap-10 p-7">
                <span className="label">{step.n}</span>
                <div>
                  <h3 className="text-[26px] font-medium tracking-[-0.03em]">
                    Your <span className="serif text-[30px]">{step.accent}</span>
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{step.text}</p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex justify-center">
          <LinkButton href="/studio">
            Open the studio
            <ArrowIcon width={16} height={16} />
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
