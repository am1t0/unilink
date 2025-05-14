//importing libraries, database models and neccessary credentials from the environmental variables
import nodemailer from 'nodemailer'
import User from '../models/user.model.js';
const SenderEmail = process.env.SENDER_EMAIL;
const SenderEmailPass = process.env.SENDER_PASSWORD;
const Client_url = process.env.CLIENT_URL;
// const ReceiverEmails = process.env.RECIEVER_LIST.split(',');

//declaring the nodemailer createtransport in a variable and passing Sender email and sender email's password as object for auth that we will be using to send email
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: SenderEmail,
        pass: SenderEmailPass,
    },
});

//the send emain function that will be sending the email and also saves the email in the database before sending it
const SendEmail = async (emailDetails) => {
    try {
        const { receiver ,sender , type } = emailDetails;
        
        const recipient = await User.findById(receiver).populate("email");

        let subject = "";
        let text = "";

        switch (type) {
            case "Link":
                subject = "👤Link Alert!";
                text = `🎉 ${sender.name} wants to follow you.\n Check out ${Client_url}/notifications`;
                break;
            case "Link-Accepted":
                subject = "👤Link Alert!";
                text = `🎉 ${sender.name} accepted your follow request.\n Check out ${Client_url}/notifications`;
                break;

            case "Like":
                subject = "❤️ You Got a Like!";
                text = `👍 ${sender.name} liked"`;
                break;

            case "Comment":
                subject = "💬 New Comment on Your Post!";
                text = `🗣️ ${sender.name} commented on your post`;
                break;

            case "Mention":
                subject = "📢 You Were Mentioned!";
                text = `👀 ${data.mentionerName} mentioned you in a ${data.location}:\n"${data.mentionText}"`;
                break;

            default:
                subject = "🔔 New Notification";
                text = "You have a new activity on your account.";
                break;
        }

        const info = await transporter.sendMail({
            from: SenderEmail,
            to: recipient,
            subject,
            text,
        });

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};


/**
 * @desc Send Email
 * @route POST /api/v1/mail/send
 * @access Private
 */
//we will be sending the email with users input that will be sent as a request in the server, we will use the subject and the main body will be text
export const sendEmailController = async (req, res) => {
    try {
        await SendEmail(req.body); // Pass the req.body to the SendEmail function
        res.status(200).send("Email sent successfully");
    } catch (error) {
        res.status(500).send("Error sending email");
    }
};

//we made a simple function and that count the number of emails in the env file and sends it to the frontend and we use it to show the number of users email will be sent to
const getUsers = (req, res) => {
    res.json(ReceiverEmails.length);
}
