import * as sass from "sass";
import fs from "node:fs";
import { success, error } from "./utils";

export async function buildCss(site: string) {
	const sitePath = `./sites/${site}`;
	const stat = fs.statSync(sitePath);
	if (!stat.isDirectory()) return;

	try {
		const output = await sass.compileAsync(`${sitePath}/main.scss`, {
			style:
				process.env.NODE_ENV === "production"
					? "compressed"
					: "expanded",
			sourceMap: false,
		});
		fs.mkdirSync(`./dist/sites/${site}/`, { recursive: true });
		fs.writeFileSync(`./dist/sites/${site}/main.css`, output.css);
		success(`Finished building site: ${site}`);
	} catch (err) {
		error(`Error building site: ${site}`);
		throw err;
	}
}
