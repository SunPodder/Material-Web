import fs from "node:fs";

export class Manifest {
	manifest: any;

	constructor(path: string) {
		this.manifest = JSON.parse(fs.readFileSync(path, "utf-8"));
	}

	updateResources(resources: string[]) {
		this.manifest.web_accessible_resources = [
			{
				resources,
				matches: ["<all_urls>"],
			},
		];
	}

	updateVersion() {
		const date = new Date();
		this.manifest.version = `${date.getFullYear()}.${String(
			date.getMonth() + 1,
		)}.${String(date.getDate())}`;
	}

	save(path: string) {
		fs.writeFileSync(path, JSON.stringify(this.manifest, null, 4));
	}
}
