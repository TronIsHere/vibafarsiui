import { Avatar } from "@/registry/ui/avatar";

export interface Member { name: string; role: string; src?: string; bio?: string; links?: { label: string; href: string }[] }

/** تیم. Member cards with an avatar that falls back to initials, a role and short links. */
export function TeamBlock({ title = "تیم ما", description, members }: { title?: string; description?: string; members: Member[] }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        {description && <p className="mt-3 text-muted-foreground">{description}</p>}
      </div>
      <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        {members.map((m) => (
          <li key={m.name} className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center">
            <Avatar name={m.name} src={m.src} size="lg" />
            <h3 className="mt-3 font-semibold">{m.name}</h3>
            <p className="text-xs text-muted-foreground">{m.role}</p>
            {m.bio && <p className="mt-2 text-xs leading-6 text-muted-foreground">{m.bio}</p>}
            {m.links && (
              <ul className="mt-3 flex gap-3">
                {m.links.map((l) => <li key={l.label}><a href={l.href} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{l.label}</a></li>)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
