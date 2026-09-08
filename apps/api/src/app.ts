import cors from "cors";
import express from "express"
import cookieParser from "cookie-parser";
import { env } from "@repo/env";




const app = express()


app.use(cors({
  origin: env.CLIENT_URL, 
  credentials: true, // required if you're sending cookies (refresh token?)
}));

app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


app.get('/', (_, res)=>{
    res.send("This is the home page...")
})



import authRouter from './modules/auth/auth.route.ts'
import orgRouter from './modules/organisation/org.route.ts'
app.use('/auth', authRouter)
app.use('/', orgRouter)

export {app};