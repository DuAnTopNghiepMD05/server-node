const nodemailer = require("nodemailer");
const authmail = {
  sendVerificationEmail: async (req, res) => {

    const {email,hoten, text} = req.body;
    
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Configure the email service or SMTP details here
      service: "gmail",
      auth: {
        user: "huynvph20687@fpt.edu.vn",
        pass: "mosklpvfiuqhlrij",
      },
    });
    const HOST_NAME = process.env.SERVER_URL;
    const PORT = process.env.PORT;

    // Compose the email message
    const mailOptions = {
      from: "amazon.com",
      to: email,
      subject: "Xác thực tài khoản",
      html: `
          <div style=" text-align: center;  max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="">
            <img src="https://iili.io/Jo3RUns.png" alt="Mô tả của ảnh" style="width: 50px; height: 55px; border-radius: 10px;">
          </div>
          <div style="text-align: center;">
            <h2 style="color: #007bff; font-size: 24px;">Xác thực tài khoản</h2>
          </div>
          <div style="font-style: initial; font-family: 'Times New Roman', Times, serif; font-weight: bold  ">
            <p style="color: #333; font-size: 16px; text-align: center;">Xin chào <span style="color: rgb(0, 104, 216); font-weight: bold; font-size: 20px;">'${username}'</span>,</p>
            <p style="color: #333; font-size: 16px; text-align: center;">Nhấn vào liên kết dưới đây để xác nhận tài khoản của bạn!</p>
            <p style="text-align: center;">
              <a href="http://${HOST_NAME}:${PORT}/api/v1/auth/verify/${"verificationToken"}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Xác nhận tài khoản</a>
            </p>
          </div>
        </div>
          `,
      text: `Xin chào '${username}', Bạn hãy ấn vào link để xác nhận nhé: http://${HOST_NAME}:${PORT}/api/v1/auth/verify/${verificationToken}`,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent successfully");
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  },
};

module.exports = authmail;
