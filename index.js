import "dotenv/config";
import { WebSocketServer } from "ultimate-ws";

if(!process.env.PORT) {
    console.error("PORT is not defined");
    process.exit(1);
}

const SEND_TO_SELF = process.env.SEND_TO_SELF === "true";

const wss = new WebSocketServer({ port: process.env.PORT });
let clientId = 0;

wss.on("connection", (ws) => {
    ws.id = clientId++;
    ws.on("message", (message, isBinary) => {
        for(const client of wss.clients) {
            if(!SEND_TO_SELF && client.id === ws.id) continue;
            client.send(message);
        }
        console.log(isBinary ? message : message.toString());
    });
});

console.log(`Server is running on port ${process.env.PORT}`);

