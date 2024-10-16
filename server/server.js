import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import morgan from 'morgan'
import {query as db} from './src/db/index.js'
import cookieParser from 'cookie-parser'


const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,

}));

app.use(express.json());
app.use(express.urlencoded({ extended: true , limit:"16kb"}));
app.use(express.static("public"))
app.use(cookieParser());
app.use(morgan('dev'));


// routes import
import userRouter from './src/routes/user.route.js'

// routes decalaration   here mounting the specific routers to the app , this each router's will use Router.use('path',(rq,res));
app.use("/api/v1/users", userRouter);




const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})