import nodemailer from "nodemailer";

export interface TypeSendEmail {
  // from?: string,
  to: string;
  subject: string;
  text: string;
  html?: string;
}
// const sampleMailOptions = {
//   from: "santa@maravianwebservices.com",
//   to: "paulkachule@hotmail.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };
export async function emailSend(args: TypeSendEmail) {
  const mailOptions: TypeSendEmail & {
    from: { name: string; address: string };
  } = {
    // from: "Secret Santa Matcher",
    // from: "santa@maravianwebservices.com",
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
    host: "mail.maravianwebservices.com",
    // host: "10.16.86.122",
    // host: "maravianwebservices.com",
    // host: "md-hk-8.webhostbox.net",

    // port: 587,
    // secure: false,
    port: 465,
    secure: true,
    auth: {
      user: "santa@maravianwebservices.com",
      pass: "79dUxGl#)B)q",
    },
    // tls: {
    //   servername: "mail.maravianwebservices.com",
    // },
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    console.log(`Message sent: ${info.messageId}`);
    if (info.accepted) return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
