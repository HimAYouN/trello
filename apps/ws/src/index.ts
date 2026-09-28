import http from "node:http";
import path from "node:path";

import express from "express";
import { Server } from "socket.io";
import { env } from "@repo/env";
import cors from "cors";

async function main() {
  const PORT = env.WS_SERVER_PORT ?? 4001;

  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: true },
  });
  
  // io.attach(server);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("client:button:clicked", (data) => {
      console.log("CLICKED");
      console.log(`[Socket:${socket.id}]:client:button:clicked`, data);
    });
  });

  // app.use(express.static(path.resolve('./public)));

  app.get("/api/v1/health", (_, res) => {
    res.status(200).json({
      health: "GOOD",
      message: " Server is working . . .",
    });
  });

  server.listen(PORT, () => {
    console.log(`WS Server is listening on http://localhost:${PORT}`);
  });
}

main();
