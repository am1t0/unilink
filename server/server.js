import express from 'express'
import 'dotenv/config'
import morgan from 'morgan'
import {query as db} from './src/db/index.js'
import cookieParser from 'cookie-parser'
import connectDB from './src/db/connectdb.js'
import cors from "cors"

const app = express();

// app.use(cors({
//   origin: process.env.CORS_ORIGIN |"http://localhost:3000" ,
//   credentials: true
// }));
app.use(cors(
  {
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
  }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true , limit:"16kb"}));
app.use(express.static("public"))
app.use(cookieParser());
app.use(morgan('dev'));




// routes import
import authRouter from './src/routes/authuser.route.js'
import postsRouter from './src/routes/post.route.js'
import conversationRouter from './src/routes/conversation.route.js'
import messageRouter from './src/routes/message.route.js'
import commentRouter from './src/routes/message.route.js'

// routes decalaration   here mounting the specific routers to the app , this each router's will use Router.use('path',(rq,res));
app.use("/api/v1/auth", authRouter);

app.use('/api/v1/posts',postsRouter);

app.use("/api/v1/comment", commentRouter);

app.use("/api/v1/conversation", conversationRouter);

app.use("/api/v1/message", messageRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  connectDB();
})