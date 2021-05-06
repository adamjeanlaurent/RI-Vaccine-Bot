const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = (to, body, subject) => {
    const senderMail = process.env.EMAIL_USER;
    const senderPass = process.env.EMAIL_APP_CODE;

    const emailTransporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service:'yahoo',
        secure: false,
        auth: {
            user: senderMail,
            pass: senderPass
        },
        debug: false,
    });

    // send mail with defined transport object
    emailTransporter.sendMail({
        from: '"Vaccine Bot" <rivaccinebot@yahoo.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: body, // html body
    });
}

module.exports = sendEmail;