const nodeMailer = require("nodemailer");
const config = require('../config/config');

/**
 * Sends an email using nodemailer
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.message - Email body text
 * @returns {Promise<void>}
 * @throws {Error} If email sending fails
 */
const sendEmail = async ({ email, subject, message }) => {
    if (!email || !subject || !message) {
        throw new Error('Missing required email parameters');
    }

    try {
        const transporter = nodeMailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            secure: false,
            service: config.SMTP_SERVICE,
            auth: {
                user: config.SMTP_MAIL,
                pass: config.SMTP_PASSWORD,
            }
        });

        const mailOptions = {
            to: email,
            from: config.SMTP_MAIL,
            subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;
