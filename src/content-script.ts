const stylesheetByHostname: Record<string, string> = {
	"discord.com": "sites/discord.com/main.css",
	"github.com": "sites/github.com/main.css",
	"reddit.com": "sites/reddit.com/main.css",
};

const hostname = location.hostname;
const stylesheet = Object.entries(stylesheetByHostname).find(
	([site]) => hostname === site || hostname.endsWith(`.${site}`),
)?.[1];

if (stylesheet) {
	const style = document.createElement("style");
	style.dataset.materialWebStylesheet = stylesheet;
	document.documentElement.appendChild(style);

	let loaded = false;

	const moveStylesheetToBody = () => {
		if (!loaded || !document.body || style.parentElement === document.body) {
			return false;
		}

		// document.body.appendChild(style);
		return true;
	};

	const observer = new MutationObserver(() => {
		if (moveStylesheetToBody()) observer.disconnect();
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});

	void fetch(chrome.runtime.getURL(stylesheet))
		.then((response) => response.text())
		.then((css) => {
			style.textContent = css;
			loaded = true;

			if (moveStylesheetToBody()) observer.disconnect();
		})
		.catch((error) => {
			console.error(
				`Failed to load stylesheet for ${stylesheet}`,
				error,
			);
		});
}

export {};
