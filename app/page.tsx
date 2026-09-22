import { Frame, HatchBand } from "@/components/landing/frame";
import { TopBar } from "@/components/landing/top-bar";
import { Hero } from "@/components/landing/hero";
import { Principles } from "@/components/landing/principles";
import { Catalog } from "@/components/landing/catalog";
import { PromptCode } from "@/components/landing/prompt-code";
import { Animations } from "@/components/landing/animations";
import { Backgrounds } from "@/components/landing/backgrounds";
import { Templates } from "@/components/landing/templates";
import { Sites } from "@/components/landing/sites";
import { Blocks } from "@/components/landing/blocks";
import { DesignSystems } from "@/components/landing/design-systems";
import { McpSteps } from "@/components/landing/mcp-steps";
import { Skills } from "@/components/landing/skills";
import { Sponsors } from "@/components/landing/sponsors";
import { CodeBlock } from "@/components/shared/code-block";
import { JsonLd } from "@/components/shared/json-ld";
import { faqJsonLd } from "@/lib/faq";
import { MonoFooter } from "@/components/landing/footer";
import { Faq } from "@/components/landing/faq";
import { buildPrompt, components } from "@/lib/registry";
import { readSource } from "@/lib/source";

export default function Home() {
  const button = components.find((c) => c.slug === "button")!;
  const code = readSource(button.file);
  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col">
      <TopBar />
      <main className="min-w-0 flex-1 overflow-x-clip">
        <JsonLd data={faqJsonLd()} />
        <Frame>
          <Hero />
          <Principles />
          <HatchBand />
          <Catalog />
          <HatchBand />
          <PromptCode
            code={code}
            codeBlock={<CodeBlock code={code} className="max-h-[440px] overflow-auto" />}
            prompt={buildPrompt(button)}
          />
          <HatchBand />
          <Blocks />
          <HatchBand />
          <Animations />
          <HatchBand />
          <Backgrounds />
          <HatchBand />
          <Templates />
          <HatchBand />
          <Sites />
          <HatchBand />
          <DesignSystems />
          <HatchBand />
          <McpSteps />
          <HatchBand />
          <Skills />
          <HatchBand />
          <Faq />
          <HatchBand />
          <Sponsors />
          <HatchBand />
          <MonoFooter />
        </Frame>
      </main>
    </div>
  );
}
