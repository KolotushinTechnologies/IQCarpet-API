const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      seucre: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendCodeForConfirmResetPassword(to, code) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Код подтверждения для смены пароля в IQCarpet",
      text: "",
      html: `
        <div>
          <h1>Для смены пароля в IQCarpet Вам необходимо отправить данный код</h1>
          <h3>${code}</h3>
        </div>
      `,
    });
  }
}

module.exports = new MailService();
