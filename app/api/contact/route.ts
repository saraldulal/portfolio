import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import portfolioData from '../../data/portfolio.json';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Configure the transporter using the built-in Gmail service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Professional HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f5;
            margin: 0;
            padding: 40px 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #050505;
            color: #ffffff;
            padding: 30px 40px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 1px;
          }
          .content {
            padding: 40px;
          }
          .field {
            margin-bottom: 24px;
          }
          .label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #71717a;
            margin-bottom: 8px;
            display: block;
          }
          .value {
            font-size: 16px;
            color: #27272a;
            line-height: 1.6;
            margin: 0;
            padding: 12px 16px;
            background-color: #f4f4f5;
            border-radius: 6px;
          }
          .message-box {
            white-space: pre-wrap;
          }
          .footer {
            text-align: center;
            padding: 24px;
            font-size: 12px;
            color: #a1a1aa;
            background-color: #fafafa;
            border-top: 1px solid #f4f4f5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Portfolio Inquiry</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name</span>
              <p class="value">${name}</p>
            </div>
            <div class="field">
              <span class="label">Email Address</span>
              <p class="value"><a href="mailto:${email}" style="color: #050505; text-decoration: none;">${email}</a></p>
            </div>
            <div class="field">
              <span class="label">Message</span>
              <p class="value message-box">${message}</p>
            </div>
          </div>
          <div class="footer">
            This message was sent automatically from your portfolio website contact form.
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: portfolioData.contact.email,
      replyTo: email,
      subject: `Portfolio Contact: New message from ${name}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
