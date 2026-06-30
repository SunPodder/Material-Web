import chalk from "chalk";

export const log = (t: string) => console.log(t);
export const success = (t: string) => console.log(chalk.bold.green(t));
export const warn = (t: string) => console.log(chalk.bold.yellow(t));
export const error = (t: string) => console.log(chalk.bold.red(t));
