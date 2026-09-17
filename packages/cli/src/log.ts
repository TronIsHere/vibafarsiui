const isTTY = Boolean(process.stdout.isTTY);
const c = (code: string, s: string) => (isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);

export const color = {
  dim: (s: string) => c("2", s),
  bold: (s: string) => c("1", s),
  green: (s: string) => c("32", s),
  yellow: (s: string) => c("33", s),
  red: (s: string) => c("31", s),
  cyan: (s: string) => c("36", s),
};

export function info(msg: string) {
  console.log(`  ${color.green("✔")} ${msg}`);
}

export function skip(msg: string) {
  console.log(`  ${color.dim("·")} ${msg}`);
}

export function warn(msg: string) {
  console.log(`  ${color.yellow("!")} ${msg}`);
}

export function fail(msg: string) {
  console.error(`  ${color.red("✖")} ${msg}`);
}

export function title(msg: string) {
  console.log(`\n${color.bold(msg)}`);
}

export function hint(msg: string) {
  console.log(color.dim(`    ${msg}`));
}
