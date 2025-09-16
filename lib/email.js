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
    from: `"Creatify  " <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Sign in to Creatify",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 350px; margin: 0 auto; padding: 20px; border-radius: 5px;">
        <img src="https://ph-files.imgix.net/4b8319b3-2803-4c0e-8095-be68e64fe699.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=2" alt="Creatify Space" style="max-width: 55px; border-radius: 6px; margin-bottom: 20px;">
        <h2 style="color: #000; margin-bottom: 15px;">Sign in to Creatify</h2>
        <p style="color: #555; margin-bottom: 25px;">Click the button below to securely log in to your Creatify Space account. This link will expire in 15 minutes.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: rgb(37, 99, 235); color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; width: -webkit-fill-available;">Sign in</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: left; color: #999; font-size: 12px;">
          <p style="color: #777; font-size: 13px; margin-top: 30px;">If you didn't request this link, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}
