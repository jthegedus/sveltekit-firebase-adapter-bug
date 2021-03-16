const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
	admin.initializeApp();
}

let svelteAdapterTestServer;
exports.svelteAdapterTest = functions.https.onRequest(async (request, response) => {
		if (!svelteAdapterTestServer) {
			functions.logger.info("Initializing SvelteKit SSR Handler");
			svelteAdapterTestServer = require("./svelteAdapterTest/index").default;
			functions.logger.info("SvelteKit SSR Handler initialised!");
		}
		return await svelteAdapterTestServer(request, response);
	});
