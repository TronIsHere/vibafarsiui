const isTTY = Boolean(process.stdout.isTTY);
const c = (code, s) => (isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);
export const color = {
    dim: (s) => c("2", s),
    bold: (s) => c("1", s),
    green: (s) => c("32", s),
    yellow: (s) => c("33", s),
    red: (s) => c("31", s),
    cyan: (s) => c("36", s),
};
export function info(msg) {
    console.log(`  ${color.green("✔")} ${msg}`);
}
export function skip(msg) {
    console.log(`  ${color.dim("·")} ${msg}`);
}
export function warn(msg) {
    console.log(`  ${color.yellow("!")} ${msg}`);
}
export function fail(msg) {
    console.error(`  ${color.red("✖")} ${msg}`);
}
export function title(msg) {
    console.log(`\n${color.bold(msg)}`);
}
export function hint(msg) {
    console.log(color.dim(`    ${msg}`));
}
