import { WebSocketServer } from "ws";
import { handleConnection } from "./handlers/connection";
import { startHeartbeat } from "./handlers/heartbeat";
import {env} from "@repo/env"

const wss = new WebSocketServer({ port: env.WS_PORT });
startHeartbeat(wss);

wss.on("connection", (socket, req) => {
  console.log("Starting ...");
  const url = new URL(req.url ?? "", "http://localhost");
  const boardId = url.searchParams.get("boardId");
  const userId = ""/* from verified JWT, as discussed earlier */;

  if (!boardId) return socket.close(4000, "boardId required");

  (socket as any).isAlive = true;
  socket.on("pong", () => { (socket as any).isAlive = true; });

  handleConnection(socket, userId, boardId);
});