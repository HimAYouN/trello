import type { WebSocket } from "ws";

type ClientMeta = { userId: string; boardId: string; isAlive: boolean };

const boardRooms = new Map<string, Set<WebSocket>>();
const clientMeta = new WeakMap<WebSocket, ClientMeta>();

export function joinBoard(socket: WebSocket, userId: string, boardId: string) {
  clientMeta.set(socket, { userId, boardId, isAlive: true });

  if (!boardRooms.has(boardId)) boardRooms.set(boardId, new Set());
  boardRooms.get(boardId)!.add(socket);
}

export function leaveBoard(socket: WebSocket) {
  const meta = clientMeta.get(socket);
  if (!meta) return;

  boardRooms.get(meta.boardId)?.delete(socket);
  if (boardRooms.get(meta.boardId)?.size === 0) boardRooms.delete(meta.boardId);
  clientMeta.delete(socket);
}

export function getMeta(socket: WebSocket) {
  return clientMeta.get(socket);
}

export function broadcastToBoard(boardId: string, message: unknown) {
  const room = boardRooms.get(boardId);
  if (!room) return;
  const data = JSON.stringify(message);
  for (const client of room) {
    if (client.readyState === client.OPEN) client.send(data);
  }
}