
import express from "express"
import cookieParser from "cookie-parser";

const app = express()



app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


app.get('/', (_, res)=>{
    res.send("HELLO There  How are you")
})


export {app};