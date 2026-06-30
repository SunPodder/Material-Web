import sass from "sass";
import fs from "node:fs";
import { log, success, error } from "./utils";

export async function buildCss(site: string) {
    const sitePath = `./sites/${site}`;
    const stat = fs.statSync(sitePath);
    if (!stat.isDirectory()) return;

    try {
        await Bun.build({
            entrypoints: [`${sitePath}/main.css`],
            minify: process.env.NODE_ENV === "production",
            outdir: `./dist/sites/${site}/`,
        });
        success(`Finished building site: ${site}`);
    } catch (err) {
        error(`Error building site: ${site}`);
        throw err;
    }
}
