import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"SketchMint" <${process.env.SMTP_USER}>`,
      to, subject, html, text,
    });
  } catch (error) {
    console.error('Email send error:', error.message);
  }
};

export const sendOrderConfirmation = async (order, userEmail) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2d3748;">Thank you for your order!</h1>
      <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
      <p><strong>Total:</strong> ₹${order.totalAmount.toLocaleString('en-IN')}</p>
      <p>We'll notify you when your order ships.</p>
      <hr/>
      <p style="color: #718096; font-size: 14px;">SketchMint - Where Art Meets Passion</p>
    </div>
  `;
  await sendEmail({ to: userEmail, subject: `Order Confirmation - ${order.orderNumber}`, html });
};

export const sendCustomOrderConfirmation = async (order, userEmail) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2d3748;">Custom Order Received!</h1>
      <p>Your custom painting order <strong>${order.orderNumber}</strong> has been received.</p>
      <p><strong>Style:</strong> ${order.sketchStyle}</p>
      <p><strong>Size:</strong> ${order.canvasSize}</p>
      <p><strong>Estimated Completion:</strong> ${order.estimatedCompletionDays} days</p>
      <p><strong>Total:</strong> ₹${order.totalAmount.toLocaleString('en-IN')}</p>
      <hr/>
      <p style="color: #718096; font-size: 14px;">SketchMint - Where Art Meets Passion</p>
    </div>
  `;
  await sendEmail({ to: userEmail, subject: `Custom Order Received - ${order.orderNumber}`, html });
};

export const sendStatusUpdate = async (orderNumber, status, userEmail) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2d3748;">Order Status Update</h1>
      <p>Your order <strong>${orderNumber}</strong> status has been updated to: <strong>${status}</strong></p>
      <hr/>
      <p style="color: #718096; font-size: 14px;">SketchMint - Where Art Meets Passion</p>
    </div>
  `;
  await sendEmail({ to: userEmail, subject: `Order Update - ${orderNumber}`, html });
};