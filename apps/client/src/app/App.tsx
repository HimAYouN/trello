import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [health, setHealth] = useState("Loading...");
  const [wsStatus, setWsStatus] = useState("Disconnected");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const getHealth = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/health");
        setHealth(res.data.message ?? "API is healthy");
      } catch (error) {
        setHealth("API is unavailable");
      }
    };

    getHealth();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const connectToBoard = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket("ws://localhost:8080?boardId=demo-board");
    socketRef.current = socket;

    socket.onopen = () => {
      setWsStatus("Connected");
      socket.send(JSON.stringify({ type: "ping", message: "hello from client" }));
    };

    socket.onmessage = (event) => {
      setWsStatus(`Message: ${event.data}`);
    };

    socket.onerror = () => {
      setWsStatus("Connection error");
    };

    socket.onclose = () => {
      setWsStatus("Disconnected");
    };
  };

  return (
    <main>
      <h1>HELLO</h1>
      <p>API status: {health}</p>
      <button onClick={connectToBoard}>CHECK WS</button>
      <p>WS: {wsStatus}</p>
    </main>
  );
}

export default App;
