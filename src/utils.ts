export const colorLog = (s: string, ansiColor: string) =>
  console.log(`\x1b[${ansiColor}m%s\x1b[0m`, s);
