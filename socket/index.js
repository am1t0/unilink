const io = require("socket.io")( 8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let users = [];

const addUser = (userId, socketId)=>{
    !users.some(user=> user.userId == userId) &&
      users.push({ userId, socketId});
}

const removeUser = (socketId)=>{
    users = users.filter(user=> user.socketId!=socketId);
}

const getUser = (userId)=>{
    return users.find(user=> user.userId == userId);
}

io.on("connection", (socket) => {

    //when user enters the chat section
    console.log('a user connected');

    //take userId and socketId from user
    socket.on("addUser", userId => { 
        addUser(userId, socket.id);

        console.log('user added')

        io.emit("getUsers", users);
    })

    //send and get message
    socket.on("sendMessage", (messageData) => {
        const user = getUser(messageData.receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                _id: messageData._id, // Ensure _id is passed
                conversationId: messageData.conversationId,
                senderId: messageData.senderId,
                text: messageData.text,
                status: 'sent',
                createdAt: messageData.createdAt
            });
        }
    });

    // Handle message received status
    socket.on("messageReceived", ({ messageId, senderId, conversationId }) => {
        if (!messageId) return; // Skip if no messageId
        
        const user = getUser(senderId);

        if (user) {
            io.to(user.socketId).emit("messageStatusUpdate", {
                messageId,
                conversationId,
                status: 'delivered'
            });
        }
    });

    // Handle message read status
    socket.on("messageRead", ({ messageId ,conversationId, senderId }) => {
        const user = getUser(senderId);
        if (user) {
            io.to(user.socketId).emit("messageStatusUpdate", {
                messageId,
                conversationId,
                status: 'read'
            });
        }
    });

    socket.on("typing", ( data ) =>{

        
        const { senderId, receiverId , conversationId} = data;
        
        const sender = getUser(senderId);
        const receiver = getUser(receiverId);
        
        io.to(receiver?.socketId).emit("senderTyping", {
          senderId,
          receiverId,
          conversationId,
        })

        io.to(data?.receiverId)
    })

    socket.on("updateMessageStatus", (messageData) => {
      
        const {conversationId, senderId, status} = messageData;
        
        console.log(senderId)
        
        //get socketId for user
        const user = getUser(senderId);


        //send the status to the sender
        io.to(user?.socketId).emit("updateMessageStatusOnSender",{
            conversationId,
            status
        })
    })

    socket.on("sendNotification", (notificationData) => {
        const { sender, receiver } = notificationData;
        const user = getUser(receiver);
  
        if (user) {
            io.to(user.socketId).emit("getNotification", notificationData);
        }
    });

    //a user lefts the chat section
    socket.on("disconnect", ()=>{
       console.log("a user is disconnected");
       removeUser(socket.Id);

       io.emit("getUsers", users);
    })
})