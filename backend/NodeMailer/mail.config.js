import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAIL_EMAIL,         // your Gmail address
    pass: process.env.NODEMAIL_PASS,       // the 16-character app password from Google
  },
});


