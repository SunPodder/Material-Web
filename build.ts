import fs from "node:fs";
import { buildCss, Manifest, log, success } from "./scripts/build";

const manifest = new Manifest("./src/manifest.json");
manifest.updateVersion();

const cssResources: string[] = [];
const sites = fs.readdirSync("./sites");
for (const site of sites) {
	await buildCss(site);
	cssResources.push(`sites/${site}/main.css`);
	log(`Registered stylesheet for site: ${site}`);
}
manifest.updateResources(cssResources);

manifest.save("./dist/manifest.json");
success("Finished writing manifest.json");

await Bun.build({
	entrypoints: ["./src/content-script.ts"],
	minify: process.env.NODE_ENV === "production",
	outdir: "./dist/",
	target: "browser",
	format: "iife",
});
success("Finished building content-script.ts");

export {};
