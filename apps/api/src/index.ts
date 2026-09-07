
import { app } from "./app.js";
import { env } from "@repo/env";


// CONNECT DB
const port = env.PORT || 3002

console.log(port)
app.listen(port, ()=> {
    console.log(`RUNNING... on the :  http://localhost:${port}`)
})