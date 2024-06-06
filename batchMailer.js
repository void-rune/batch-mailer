const fs = require("fs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const fromHost = process.env.FROM_HOST;
const fromName = process.env.FROM_NAME;
const fromEmail = process.env.FROM_EMAIL;
const unsubEmail = process.env.UNSUB_EMAIL;
const emailHost = process.env.EMAIL_HOST; // Email provider host
const emailPort = process.env.EMAIL_PORT; // Email provider port
const emailPass = process.env.EMAIL_TOKEN; // Email provider user password token

const emailConfig = {
  pool: true,
  host: emailHost,
  port: emailPort, // or 465 for SSL
  debug: true,
  secure: false, // true for 465, false for other ports
  requireTLS: true, // Enable STARTTLS
  auth: {
    user: fromEmail, // Replace with your email address
    pass: emailPass, // Replace with your email password or app password
  },
  tls: {
    rejectUnauthorized: false,
  },
};

// Nodemailer setup
const transporter = nodemailer.createTransport(emailConfig);

// HTML content for your newsletter
const getNewsletterHTML = (token) => {
  return `<html>
    <body>
      <h1>Newsletter test content</h1>
      <a href="${fromHost}/unsubscribe?token=${token}">Unsubscribe</a>
    </body>
  </html>
`;
};

// Read subscribers from a text file (replace 'subscribers.txt' with your file path)
const subscribersFilePath = "subscribers.txt";

function readSubscribersFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data.split("\n").map((subscriber) => {
      const info = subscriber.split(",");
      return { email: info[0].trim(), token: info[1].trim() };
    });
  } catch (error) {
    console.error("Error reading subscribers file:", error);
    return [];
  }
}

async function sendEmails() {
  const subscribers = readSubscribersFromFile(subscribersFilePath);
  const numSubscribers = subscribers.length;
  for (let i = 0; i < numSubscribers; i++) {
    const toEmail = subscribers[i].email;
    const toToken = subscribers[i].token;
    const mailOptions = {
      from: {
        name: fromName,
        address: fromEmail,
      },
      to: toEmail,
      subject: "My Project News",
      html: getNewsletterHTML(toToken),
      headers: {
        "List-Unsubscribe": `<mailto:${unsubEmail}>, <${fromHost}/unsubscribe?token=${toToken}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Emails sent to: ${toEmail} (${toToken})`);
      console.log(`Message ID: ${info.messageId}`);
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  }
}

// Call the function to send emails
sendEmails();
