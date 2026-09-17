export const REGISTRY_TYPES = ["component", "animation", "background", "template", "block", "theme", "lib"] as const;
export type RegistryType = (typeof REGISTRY_TYPES)[number];

export type CatalogItem = {
  type: RegistryType;
  slug: string;
  name: string;
  nameEn?: string;
  desc: string;
  file: string;
  target: string;
  url: string;
  deps: string[];
  registryDeps: string[];
  tags: string[];
  category?: string;
  aliases: string[];
  prompt?: string;
};

export type Catalog = {
  name: string;
  homepage: string;
  schema?: string;
  items: CatalogItem[];
};

export type RegistryFile = {
  path: string;
  content: string;
  type?: string;
};

export type RegistryItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  css?: string;
  prompt?: string;
};
