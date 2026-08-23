
import { app } from "./app.js";
// import { env } from "@repo/env";


// CONNECT DB
// const port = env.PORT
const port = 3000

console.log(port)
app.listen(port, ()=> {
    console.log("RUNNING...")
})