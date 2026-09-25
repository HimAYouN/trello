import type { WebSocketServer } from "ws";
import { getMeta, leaveBoard } from "../connectionManager";

export function startHeartbeat(wss: WebSocketServer, intervalMs = 30000) {
  const interval = setInterval(() => {
    wss.clients.forEach((socket: any) => {
      if (socket.isAlive === false) {
        leaveBoard(socket);
        return socket.terminate();   // no pong since last check -> kill it
      }
      socket.isAlive = false;
      socket.ping();
    });
  }, intervalMs);

  wss.on("close", () => clearInterval(interval));
}