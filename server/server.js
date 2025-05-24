import express from "express";
import "dotenv/config";
import morgan from "morgan";
import { query as db } from "./src/db/index.js";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/connectdb.js";
import cors from "cors";
import mongoose from "mongoose";
import Notification from "./src/models/notifications.model.js";

const app = express();

app.use(cors(
  {
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
  }
));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true , limit:"10mb"}));
app.use(express.static("public"))
app.use(cookieParser());
app.use(morgan('dev'));




// routes import
import authRouter from "./src/routes/authuser.route.js";
import postsRouter from "./src/routes/post.route.js";
import conversationRouter from "./src/routes/conversation.route.js";
import messageRouter from "./src/routes/message.route.js";
import commentRouter from "./src/routes/message.route.js";
import postInteractionRouter from "./src/routes/post-interaction.route.js";
import userRouter from "./src/routes/user.route.js";
import linkRouter from "./src/routes/links.route.js";
import notificationsRouter from "./src/routes/notifications.route.js";
import mailRouter from "./src/routes/mail.route.js"
import savePostsRouter from "./src/routes/save.posts.routes.js";

// routes decalaration   here mounting the specific routers to the app , this each router's will use Router.use('path',(rq,res));
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/saveposts", savePostsRouter);


app.use("/api/v1/comment", commentRouter);

app.use("/api/v1/conversation", conversationRouter);

app.use("/api/v1/message", messageRouter);

app.use("/api/v1/post-interaction", postInteractionRouter);

app.use("/api/v1/links", linkRouter);

app.use("/api/v1/notification", notificationsRouter);

app.use("/api/v1/mail", mailRouter);

const port = process.env.PORT || 3001;

// async function insertLikeNotifications() {
//   const receiverId = new mongoose.Types.ObjectId("67af6f22021415b9abdf2679");
//   const postId = new mongoose.Types.ObjectId("6802113ba8202ebde6d56aee");

//   const senderIds = [
//     "67a617b098d8c770290229db",
//     "67cef6e212b3e95e4ff93be1",
//     "67cef718b9b99b1485e1d3bc"
//   ];

//   const notifications = senderIds.map(senderId => ({
//     sender: new mongoose.Types.ObjectId(senderId),
//     receiver: receiverId,
//     type: "Like",
//     status: "unread",
//     deliveryMethod: "socket",
//     postId: postId
//   }));

//   try {
//     await Notification.insertMany(notifications);
//     console.log("Like notifications inserted successfully.");
//   } catch (err) {
//     console.error("Error inserting like notifications:", err.message);
//   }
// }

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  connectDB();
});
