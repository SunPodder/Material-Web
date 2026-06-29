import fs from "node:fs";
import chalk from "chalk";

async function buildSite(site: string) {
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
		cssResources.push(`sites/${site}/main.css`);
		log(`Registered stylesheet for site: ${site}`);
	} catch (err) {
		error(`Error building site: ${site}`);
		throw err;
	}
}

const log = (t: string) => console.log(t);
const success = (t: string) => console.log(chalk.bold.green(t));
const warn = (t: string) => console.log(chalk.bold.yellow(t));
const error = (t: string) => console.log(chalk.bold.red(t));

const chromeManifest = JSON.parse(
	fs.readFileSync("./src/manifest.json", "utf-8"),
);
const cssResources: string[] = [];
const date = new Date();
chromeManifest.version = `${date.getFullYear()}.${String(
	date.getMonth() + 1,
)}.${String(date.getDate())}`;

const sites = fs.readdirSync("./sites");
for (const site of sites) {
	await buildSite(site);
}

chromeManifest.web_accessible_resources = [
	{
		resources: cssResources,
		matches: ["<all_urls>"],
	},
];

fs.writeFileSync(
	"./dist/manifest.json",
	JSON.stringify(chromeManifest, null, 4),
);
success("Finished writing manifest.json");

await Bun.build({
	entrypoints: ["./src/content-script.ts"],
	minify: process.env.NODE_ENV === "production",
	outdir: "./dist/",
	target: "browser",
	format: "iife",
});
success("Finished building content-script.ts");

await Bun.build({
	entrypoints: ["./src/background.ts"],
	minify: process.env.NODE_ENV === "production",
	outdir: "./dist/",
	target: "browser",
	format: "iife",
});
success("Finished building background.ts");

export {};
