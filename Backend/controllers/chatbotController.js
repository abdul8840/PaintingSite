import OpenAI from 'openai';
import ChatHistory from '../models/ChatHistory.js';
import Order from '../models/Order.js';
import CustomOrder from '../models/CustomOrder.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are SketchMint's AI assistant. SketchMint is an online platform where customers can buy ready-made paintings and order custom paintings.

Key information:
- We sell paintings in categories: oil, acrylic, watercolor, pencil, charcoal, digital, mixed-media
- Custom painting sizes: 8x10 to 36x48 inches
- Custom styles: pencil sketch, charcoal, watercolor, oil painting, digital illustration, line art, pop art, caricature, realistic, abstract
- Framing options: no frame, basic black/white, wooden natural/dark, golden classic, silver modern, floating frame
- Standard delivery: 14-28 days for custom orders, 5-10 days for ready artworks
- Rush orders available at 50% premium (half the time)
- Each custom order includes 2 free revisions
- Free shipping on orders over $200
- Payment via Stripe (credit/debit cards)
- Returns accepted within 14 days for ready-made artworks

Be helpful, friendly, and concise. If asked about order status and you have order information, provide it. Otherwise, guide them to check their dashboard or contact support at support@sketchmint.com.

Keep responses under 200 words unless detailed explanation is needed.`;

// @desc    Chat with AI assistant
// @route   POST /api/chatbot/message
export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ sessionId: sid });
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        user: req.user?._id || null,
        sessionId: sid,
        messages: [],
      });
    }

    // Check for order tracking
    let orderContext = '';
    if (req.user && (message.toLowerCase().includes('order') || message.toLowerCase().includes('track') || message.toLowerCase().includes('status'))) {
      const recentOrders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('orderNumber orderStatus paymentStatus totalAmount createdAt estimatedDelivery')
        .lean();

      const customOrders = await CustomOrder.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('orderNumber status paymentStatus totalAmount sketchStyle canvasSize estimatedDelivery')
        .lean();

      if (recentOrders.length > 0 || customOrders.length > 0) {
        orderContext = '\n\nCustomer order info:\n';
        recentOrders.forEach(o => {
          orderContext += `- Order ${o.orderNumber}: Status=${o.orderStatus}, Payment=${o.paymentStatus}, Total=$${o.totalAmount}\n`;
        });
        customOrders.forEach(o => {
          orderContext += `- Custom ${o.orderNumber}: Status=${o.status}, Style=${o.sketchStyle}, Size=${o.canvasSize}, Total=$${o.totalAmount}\n`;
        });
      }
    }

    // Build messages for AI
    const aiMessages = [
      { role: 'system', content: SYSTEM_PROMPT + orderContext },
    ];

    // Add recent history (last 10 messages)
    const recentMessages = chatHistory.messages.slice(-10);
    recentMessages.forEach(m => {
      aiMessages.push({ role: m.role, content: m.content });
    });

    aiMessages.push({ role: 'user', content: message });

    let assistantMessage;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: aiMessages,
        max_tokens: 500,
        temperature: 0.7,
      });

      assistantMessage = response.choices[0].message.content;
    } catch (aiError) {
      // Fallback responses when AI is unavailable
      assistantMessage = getFallbackResponse(message);
    }

    // Save to history
    chatHistory.messages.push({ role: 'user', content: message });
    chatHistory.messages.push({ role: 'assistant', content: assistantMessage });
    await chatHistory.save();

    res.json({
      success: true,
      message: assistantMessage,
      sessionId: sid,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/chatbot/history/:sessionId
export const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ sessionId: req.params.sessionId });
    res.json({
      success: true,
      messages: chatHistory?.messages || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fallback responses
function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
    return 'Our custom paintings start at $79 for an 8x10 pencil sketch. Prices vary based on size, style, and framing. You can use our price calculator on the Custom Painting page to get an exact quote. Ready-made artworks range from $50 to $5000+.';
  }
  if (msg.includes('delivery') || msg.includes('shipping') || msg.includes('how long')) {
    return 'Ready-made artworks ship within 3-5 business days with delivery in 5-10 days. Custom paintings take 14-28 days to complete, plus shipping. Rush orders (50% premium) take half the time. Free shipping on orders over $200!';
  }
  if (msg.includes('custom') || msg.includes('commission')) {
    return 'To order a custom painting: 1) Upload your reference photo, 2) Choose size, style, and options, 3) Review the price, 4) Checkout! You get 2 free revisions. Visit our Custom Painting page to get started.';
  }
  if (msg.includes('return') || msg.includes('refund')) {
    return 'We accept returns within 14 days for ready-made artworks in original condition. Custom paintings are non-refundable once work begins, but we offer revisions to ensure satisfaction. Contact support@sketchmint.com for help.';
  }
  if (msg.includes('size')) {
    return 'We offer sizes from 8x10 inches to 36x48 inches. Popular sizes: 11x14, 16x20, 24x30. Custom sizes are also available. Larger canvases create more impact but take longer to complete.';
  }
  if (msg.includes('track') || msg.includes('order') || msg.includes('status')) {
    return 'You can track your order in your Dashboard under "My Orders". Each order has a tracking number once shipped. If you need help, please provide your order number or contact support@sketchmint.com.';
  }

  return 'Thank you for reaching out! I can help with pricing, delivery times, custom painting options, order tracking, and more. What would you like to know about SketchMint?';
}