
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");


function App() {
 
   const handleEvent = ()=>{
    console.log("CLICKED")
    socket.emit("client:button:clicked", 'true')
   }

  return (
    <main>
      <h1>HELLO</h1>
      <button onClick={handleEvent}>SEND EVENT</button>
      <ul>
        
      </ul>
    </main>
  );
}

export default App;
