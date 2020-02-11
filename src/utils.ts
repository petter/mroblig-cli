export const colorLog = (s: string, ansiColor: string) =>
  console.log(`\x1b[${ansiColor}m%s\x1b[0m`, s);

export const oblig3ExerciseMap = (n: number) => {
  return [1, 3, 5, 6, 7, 8, 9][n - 1];
};
