import nodemailer from 'nodemailer';
import { ErrorHandler } from './errorHandler.js';

export const sendMail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Ecom" <lovishduggal69@gmail.com>', // sender address
        to,
        subject,
        html,
    });
    return info;
};
