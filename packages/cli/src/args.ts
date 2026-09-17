export type Flags = {
  command: string;
  positionals: string[];
  cwd: string;
  registry?: string;
  font: "vazirmatn" | "iransans";
  theme: string;
  yes: boolean;
  overwrite: boolean;
  install: boolean;
  dryRun: boolean;
  help: boolean;
  version: boolean;
};

export function parseArgs(argv: string[]): Flags {
  const flags: Flags = {
    command: "",
    positionals: [],
    cwd: process.cwd(),
    font: "vazirmatn",
    theme: "graphite",
    yes: false,
    overwrite: false,
    install: true,
    dryRun: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "-h":
      case "--help":
        flags.help = true;
        break;
      case "-v":
      case "--version":
        flags.version = true;
        break;
      case "-y":
      case "--yes":
        flags.yes = true;
        break;
      case "--overwrite":
      case "--force":
        flags.overwrite = true;
        break;
      case "--no-install":
        flags.install = false;
        break;
      case "--dry-run":
        flags.dryRun = true;
        break;
      case "--cwd":
        flags.cwd = next() ?? flags.cwd;
        break;
      case "--registry":
        flags.registry = next();
        break;
      case "--font": {
        const v = (next() ?? "").toLowerCase();
        flags.font = v === "iransans" ? "iransans" : "vazirmatn";
        break;
      }
      case "--theme":
        flags.theme = next() ?? "graphite";
        break;
      default:
        if (a.startsWith("-")) throw new Error(`Unknown flag: ${a}`);
        if (!flags.command) flags.command = a;
        else flags.positionals.push(a);
    }
  }

  return flags;
}
