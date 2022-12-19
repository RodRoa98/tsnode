import Config from '../utils/config';
import { createTransport } from 'nodemailer';
import { to } from '../helpers/fetch.helper';

const config = Config.get();

interface IEmailSendReq {
  email: string;
  message: string;
  subject: string;
}

export const sendEmail = (params: IEmailSendReq) => {
  const { email, message, subject } = params;
  const { host, name, pass, port, replyToMail, replyToName, user, cc } = config.service.mail;

  const transporter = createTransport({
    host,
    port,
    auth: {
      pass,
      user,
    },
  });

  return to(
    transporter.sendMail({
      attachments: [],
      bcc: [],
      cc,
      from: `"${name}" <${user}>`,
      replyTo: `"${replyToName}" <${replyToMail}>`,
      subject,
      html: `<p>${email}:: ${message}<p>`,
      to: email,
    })
  );
};
