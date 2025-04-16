import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import handlebarOptions from "./viewEngine";

 
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),  
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as SMTPTransport.Options);  

 transporter.use("compile", hbs(handlebarOptions));
