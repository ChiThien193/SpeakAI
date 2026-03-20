import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, MAIL_FROM


def send_reset_password_email(to_email: str, reset_link: str) -> None:
    if not SMTP_USER or not SMTP_PASSWORD:
        raise ValueError("Thiếu cấu hình SMTP_USER hoặc SMTP_PASSWORD")

    subject = "SpeakAI - Đặt lại mật khẩu"
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #0f172a;">
        <h2>Đặt lại mật khẩu SpeakAI</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản SpeakAI.</p>
        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
        <p>
          <a href="{reset_link}"
             style="display:inline-block;padding:12px 20px;background:#1e40af;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;">
             Đặt lại mật khẩu
          </a>
        </p>
        <p>Hoặc mở trực tiếp link này:</p>
        <p><a href="{reset_link}">{reset_link}</a></p>
        <p>Link này sẽ hết hạn sau 15 phút.</p>
        <p>Nếu bạn không yêu cầu thao tác này, hãy bỏ qua email.</p>
      </body>
    </html>
    """

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = MAIL_FROM
    message["To"] = to_email
    message.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(MAIL_FROM, to_email, message.as_string())