import nodemailer from "nodemailer";
import { env } from "~/env";

export interface TypeSendEmail {
  // from?: string,
  to: string;
  subject: string;
  text: string;
  html?: string;
}
export async function emailSend(args: TypeSendEmail) {
  const mailOptions: TypeSendEmail & {
    from: { name: string; address: string };
  } = {
    from: {
      name: "Secret Santa",
      address: "santa@maravianwebservices.com",
    },
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html ?? `<b>${args.text}</b>`,
  };
  const transporter = nodemailer.createTransport({
    name: "Secret Santa",
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: true,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
    // tls: {
    //   servername: "mail.maravianwebservices.com",
    // },
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log(info);
    // console.log(`Message sent: ${info.messageId}`);
    if (info.accepted) return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
