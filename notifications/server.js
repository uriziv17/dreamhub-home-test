import { WebSocketServer } from "ws";
import { randomUUID } from "node:crypto";

const wss = new WebSocketServer({ port: 8080 });
const types = ["info", "warning", "error", "success"];
const samples = [
	"Deployment to **production** completed successfully.",
	"`API request` to /v1/users returned 500.",
	"High memory usage on `worker-3` — *please investigate*.",
	"New customer signed up: **Acme Inc.**",
	"Background job finished in 2.3s.",
	"Rate limit warning for `client_42`.",
];

wss.on("connection", (ws) => {
	const interval = setInterval(() => {
		const notification = JSON.stringify({
			id: randomUUID(),
			type: types[Math.floor(Math.random() * types.length)],
			text: samples[Math.floor(Math.random() * samples.length)],
			timestamp: Date.now(),
		});
		console.log("Sending notification:", notification);
		ws.send(notification);
	}, 2000);

	ws.on("message", (data) => {
		ws.send(
			JSON.stringify({
				id: randomUUID(),
				type: "info",
				text: `You said: ${data.toString()}`,
				timestamp: Date.now(),
			}),
		);
	});

	ws.on("close", () => clearInterval(interval));
});
