import { Accordion } from "@/registry/ui/accordion";

/** پرسش‌های متداول. Two-column on desktop: intro on the start side, accordion on the end. */
export function FaqBlock({ title = "پرسش‌های متداول", description = "اگر جواب‌تان این‌جا نیست، بپرسید؛ معمولاً در یک روز کاری جواب می‌دهیم.", items }: { title?: string; description?: string; items: { id: string; title: string; content: string }[] }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        <div className="lg:col-span-3"><Accordion items={items} defaultOpen={[items[0]?.id]} /></div>
      </div>
    </section>
  );
}
