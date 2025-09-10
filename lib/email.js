import nodemailer from "nodemailer";

export async function SendMagicLinkEmail(email, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Creatify Space" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Secure Login Link for Creatify Space",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <img src="https://your-company-logo-url.com" alt="Creatify Space" style="max-width: 150px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-bottom: 15px;">Login to Your Account</h2>
        <p style="color: #555; margin-bottom: 25px;">Click the button below to securely log in to your Creatify Space account. This link will expire in 15 minutes.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Log In Securely</a>
        </div>
        
        <p style="color: #777; font-size: 13px; margin-top: 30px;">If you didn't request this link, you can safely ignore this email.</p>
        <p style="color: #777; font-size: 13px;">For security, this login link can only be used once.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Creatify Space. All rights reserved.</p>
          <p>123 Startup Street, San Francisco, CA 94107</p>
        </div>
      </div>
    `,
  });
}