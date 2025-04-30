const nodemailer =require("nodemailer")
module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host:process.env.Host,
      service: process.env.SERVICE,
      post:Number(process.env.EMAIL_PORT),
      secure:Boolean(process.env.SECURE),
      auth: {
        user: process.env.APP_Email_ADDRESS,
        pass: process.env.APP_Email_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text:text
    });
    // const info = await transporter.sendMail(mailOptions);
    // console.log("email sent " + info.response);
  } catch (error) {
    console.log('email was not sent')
    console.log(error);
    throw new Error("internal server error(nodemailer )");
  }
};