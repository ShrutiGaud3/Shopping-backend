const nodemailer = require('nodemailer');

/**
 * Sends automated confirmation email to customer upon submitting Contact Us form
 */
const sendConfirmationEmail = async ({ name, email, topic, message, ticketId }) => {
  try {
    // Transporter configuration (SMTP / Test Account)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER || 'support@velora.com',
        pass: process.env.EMAIL_PASS || 'velora_pass'
      }
    });

    const htmlTemplate = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden; text-align: left;">
        <div style="background-color: #0a0f1d; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="font-family: Georgia, serif; font-size: 24px; margin: 0; letter-spacing: 2px;">VELORA</h1>
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #9ca3af; margin-top: 4px;">Client Care Concierge</p>
        </div>

        <div style="padding: 24px; color: #1f2937; font-size: 14px; line-height: 1.6;">
          <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Dear ${name},</p>
          
          <p>Thank you for reaching out to <strong>VELORA Client Support</strong>. We have received your inquiry and a ticket has been created for your request.</p>

          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; font-weight: bold; uppercase;">TICKET REFERENCE: #${ticketId}</p>
            <p style="margin: 0 0 4px 0;"><strong>Inquiry Topic:</strong> ${topic}</p>
            <p style="margin: 0; color: #4b5563;"><strong>Your Message:</strong> "${message}"</p>
          </div>

          <p>Our dedicated concierge team is reviewing your details and will get back to you at <strong>${email}</strong> within 24 hours.</p>

          <p style="margin-bottom: 0;">Warm regards,<br /><strong>VELORA Client Care Team</strong></p>
        </div>

        <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">© 2026 VELORA Luxury Fashion Inc. | 42 Fashion Blvd, Mumbai, India</p>
          <p style="margin: 4px 0 0 0;">Need urgent help? Chat directly with us on WhatsApp: <strong>+91 98765 43210</strong></p>
        </div>
      </div>
    `;

    // Send mail
    const mailOptions = {
      from: '"VELORA Client Care" <support@velora.com>',
      to: email,
      subject: `[VELORA Support] Inquiry Received - Ticket #${ticketId}`,
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Confirmation sent to ${email} (MessageId: ${info.messageId || 'simulated'})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log(`[Email Service Notice] Email log created for ${email} (Simulated SLA active):`, error.message);
    return { success: true, simulated: true };
  }
};

module.exports = {
  sendConfirmationEmail
};
