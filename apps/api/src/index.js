import dotenv from "dotenv";
import { app } from "./app.js";


dotenv.config({
    path : "./.env"
})

// CONNECT DB

app.listen(3000, ()=> {
    console.log("RUNNING...")
})