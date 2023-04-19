// Modules
import RPC from "discord-rpc";

const client = new RPC.Client({
	transport: "websocket"
});

client.login({
	clientId: "182611509229125632",
	scopes: [
		"rpc",
		"rpc.api"
	]
});

client.on("ready", () => {
	console.log("RPC ready");
});

export default client;
