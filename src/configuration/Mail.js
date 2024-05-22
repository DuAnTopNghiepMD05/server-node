const nodemailer = require("nodemailer");

const authmail = {
  sendVerificationEmail: async (req, res) => {
    const { email, hoten, orderStatus, deliveryDetails, items, totalPrice, shippingFee, discount, finalPrice } = req.body;
    console.log(email, hoten, orderStatus, deliveryDetails, items, totalPrice, shippingFee, discount, finalPrice);
    // Map orderStatus to corresponding message
    const orderStatusMessages = {
      1: "đang xử lý",
      2: "đang giao hàng",
      3: "giao thành công",
      4: "đã huỷ",
    };

    const statusMessage = orderStatusMessages[orderStatus] || "trạng thái không xác định";

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ducmtph20223@fpt.edu.vn",
        pass: "jkhinclywdcrtiop",
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
      },
    });

    const HOST_NAME = process.env.SERVER_URL;
    const PORT = process.env.PORT;

    // Compose the email message
    const mailOptions = {
      from: "no-reply@amazon.com",
      to: email,
      subject: "Cập nhật trạng thái đơn hàng",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background-color: #007bff; padding: 10px; text-align: center;">
            <img src="https://iili.io/Ji1fDRR.png" alt="Logo" style="width: 200px;">
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #007bff;">Cảm ơn bạn đã đặt hàng tại MIMI!</h2>
            <p>Xin chào <span style="color: #ed2600; font-weight: bold;">${hoten}</span>,</p>
            <p>MIMI đã nhận được yêu cầu đặt hàng của bạn và đang xử lý. Bạn sẽ nhận được thông báo tiếp theo khi đơn hàng của bạn sẵn sàng được giao.</p>
            <div style="text-align: center; margin: 20px 0;">
              <span href="http://${process.env.SERVER_URL}:${process.env.PORT}/api/v1/orders/track" style="display: inline-block; padding: 10px 20px; background-color: #ff5722; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Tình trạng đơn hàng: ${statusMessage}</span>
            </div>
            <p>*Lưu ý nhỏ cho bạn: Bạn sẽ nhận nhận hàng khi trạng thái đơn hàng là "Đang giao hàng" và nhớ kiểm tra mã đơn hàng. Thông tin người gửi và mã vận đơn đã nhận được kèm theo đơn hàng.</p>
            <hr>
            <div>
              <h3 style="color: #007bff;">Đơn hàng được giao đến</h3>
              <p><strong>Tên:</strong> ${deliveryDetails.name}</p>
              <p><strong>Địa chỉ nhận:</strong> ${deliveryDetails.address}</p>
              <p><strong>Điện thoại:</strong> ${deliveryDetails.phone}</p>
              <p><strong>Email:</strong> ${deliveryDetails.email}</p>
            </div>
            <hr>
           
            <hr>
            <div style="text-align: right;">
              <p><strong>Thành tiền:</strong> ${totalPrice}</p>
              <p><strong>Tổng cộng:</strong> ${finalPrice}</p>
            </div>
          </div>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
            <p>Giao hàng bởi: <strong>MIMI</strong></p>
          </div>
        </div>
      `,
      text: `Xin chào ${hoten}, Trạng thái đơn hàng của bạn: ${statusMessage}. Bạn có thể theo dõi đơn hàng tại: http://${process.env.SERVER_URL}:${process.env.PORT}/api/v1/orders/track`,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent successfully");
      res.status(200).send("Verification email sent successfully");
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).send("Error sending verification email");
    }
  },
};

module.exports = authmail;
