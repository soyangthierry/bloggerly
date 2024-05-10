const nodemailer = require('nodemailer')

const sendMail = async (options) => {
    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAILAUTH_USER,
            pass: process.env.MAILAUTH_PASS
        }
    })
    
    const config = {
        from: "Thierry Soyang <soyangthierry4@gmail.com>",
        to: options.mail,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(config)
}

module.exports = sendMail;
