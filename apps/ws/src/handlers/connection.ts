import type { WebSocket } from "ws";
import { joinBoard, leaveBoard } from "../connectionManager";

export function handleConnection(socket: WebSocket, userId: string, boardId: string) {
  joinBoard(socket, userId, boardId);

  socket.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.type === "leave") {
      leaveBoard(socket);        // user clicked "leave" but tab stays open
      socket.close();
    }
    // ...other message types
  });

  socket.on("close", () => {
    leaveBoard(socket);          // tab closed / connection dropped
  });
}