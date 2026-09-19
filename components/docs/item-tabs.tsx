import { CodeBlock } from "@/components/shared/code-block";
import type { Lang } from "@/lib/highlight";
import { ItemTabsClient, type DemoRef, type ItemTabsClientProps } from "./item-tabs-client";

export type { DemoRef };

export interface CodeFile {
  name: string;
  code: string;
  lang?: Lang;
}

export interface ItemTabsProps extends Omit<ItemTabsClientProps, "files"> {
  files: CodeFile[];
}

/** Server half of the item tabs: highlights each file once at build time and hands the client the rendered blocks. */
export function ItemTabs({ files, ...props }: ItemTabsProps) {
  return (
    <ItemTabsClient
      {...props}
      files={files.map((f) => ({
        name: f.name,
        code: f.code,
        block: <CodeBlock code={f.code} lang={f.lang} className="max-h-[640px] overflow-auto" />,
      }))}
    />
  );
}
