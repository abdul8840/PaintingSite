import OpenAI from 'openai';
import ChatHistory from '../models/ChatHistory.js';
import Order from '../models/Order.js';
import CustomOrder from '../models/CustomOrder.js';

let openai = null;

try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your_openai_api_key') {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (err) {
  console.warn('OpenAI chatbot initialization failed:', err.message);
}

const SYSTEM_PROMPT = `You are SketchMint's friendly AI assistant. SketchMint is an Indian online platform for buying original paintings and ordering custom artwork.

Key information:
- ARTWORK STORE: Original paintings in categories like portraits, landscapes, abstract, digital art.
- CUSTOM PAINTINGS: Customers upload a photo and we transform it into art.
- SIZES: 8x10 to 36x48 inches. Custom sizes available.
- STYLES: Pencil sketch (₹799+), Charcoal (₹879+), Watercolor (₹1039+), Oil painting (₹1279+), Digital illustration (₹959+), Line art (₹719+), Pop art (₹1039+), Caricature (₹879+), Realistic (₹1199+), Abstract (₹959+)
- FRAMES: No frame, Basic black/white (₹299), Wooden (₹499), Golden classic (₹799), Silver modern (₹699), Floating (₹599)
- DELIVERY: Ready artworks 3-5 days + 5-10 days shipping. Custom paintings 14-28 days + shipping. Rush orders half time at 50% premium.
- SHIPPING: Free above ₹2,000. Otherwise ₹150.
- PAYMENT: Razorpay (UPI, Cards, Net Banking, Wallets). Also COD available.
- TAX: 18% GST included.
- RETURNS: 14 days for ready artworks. Custom orders get 2 free revisions.
- CONTACT: support@sketchmint.com

All prices in Indian Rupees (₹). Be helpful and concise.`;

function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('expensive')) {
    return 'Our custom paintings start at $79 for an 8x10 pencil sketch. Prices depend on size, style, and framing. Here\'s a quick guide:\n\n• Pencil Sketch: from $79\n• Watercolor: from $103\n• Oil Painting: from $126\n• Digital Art: from $95\n\nLarger sizes and frames cost more. Try our price calculator on the Custom Painting page for an exact quote! 🎨';
  }

  if (msg.includes('deliver') || msg.includes('shipping') || msg.includes('how long') || msg.includes('time')) {
    return 'Here are our delivery timelines:\n\n📦 **Ready Artworks:** Ships in 3-5 days, delivers in 5-10 business days\n🎨 **Custom Paintings:** 14-28 days creation + 5-10 days shipping\n⚡ **Rush Orders:** Half the time at 50% premium\n🚚 **Free shipping** on orders over $200!\n\nYou can track your order anytime from your dashboard.';
  }

  if (msg.includes('custom') || msg.includes('commission') || msg.includes('order painting') || msg.includes('paint my')) {
    return 'Ordering a custom painting is easy! 🎨\n\n1️⃣ Upload your favorite photo\n2️⃣ Choose style (pencil, watercolor, oil, etc.)\n3️⃣ Pick canvas size and frame\n4️⃣ Our AI suggests the best style!\n5️⃣ Review price and checkout\n\nYou get 2 free revisions to ensure you love it. Visit our **Custom Painting** page to start!';
  }

  if (msg.includes('return') || msg.includes('refund') || msg.includes('money back')) {
    return 'Our return policy:\n\n✅ Ready-made artworks: 14-day return in original condition\n🎨 Custom paintings: Non-refundable once started, but includes 2 free revisions\n💰 Refunds processed within 5-7 business days\n\nContact support@sketchmint.com for any issues!';
  }

  if (msg.includes('size') || msg.includes('dimension') || msg.includes('big') || msg.includes('small')) {
    return 'We offer these canvas sizes:\n\n📏 Small: 8x10, 11x14, 12x16\n📐 Medium: 16x20, 18x24, 20x24\n🖼️ Large: 24x30, 24x36, 30x40, 36x48\n📐 Custom sizes also available!\n\nMost popular: **16x20** for portraits and **24x36** for landscapes.';
  }

  if (msg.includes('track') || msg.includes('order status') || msg.includes('where is my')) {
    return 'You can track your order in several ways:\n\n1️⃣ Go to **My Orders** in your dashboard\n2️⃣ Use the **Track Order** page with your order number\n3️⃣ Check your email for tracking updates\n\nNeed help with a specific order? Share your order number and I\'ll look into it!';
  }

  if (msg.includes('style') || msg.includes('which') || msg.includes('recommend') || msg.includes('suggest')) {
    return 'Here are our most popular styles:\n\n✏️ **Pencil Sketch** - Classic, timeless\n🖤 **Charcoal** - Dramatic, bold\n🎨 **Watercolor** - Soft, dreamy\n🖌️ **Oil Painting** - Rich, textured\n💻 **Digital Art** - Modern, clean\n\nTip: Upload your photo on the Custom Painting page and our **AI Style Suggester** will recommend the best styles for your image! 🤖';
  }

  if (msg.includes('coupon') || msg.includes('discount') || msg.includes('promo') || msg.includes('code')) {
    return 'We have some active promotions! 🎉\n\nTry these codes at checkout:\n• **WELCOME10** - 10% off your first order\n• **CUSTOM20** - 20% off custom paintings\n\nSign up for our newsletter for exclusive deals!';
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('help')) {
    return 'Hello! Welcome to SketchMint! 👋🎨\n\nI can help you with:\n• 💰 Pricing information\n• 🎨 Custom painting orders\n• 📦 Delivery & shipping\n• 🔍 Order tracking\n• 🖼️ Style recommendations\n• 🏷️ Discount codes\n\nWhat would you like to know?';
  }

  if (msg.includes('payment') || msg.includes('pay') || msg.includes('card') || msg.includes('stripe')) {
    return 'We accept all major credit and debit cards through Stripe:\n\n💳 Visa, Mastercard, American Express, Discover\n🔒 All payments are SSL encrypted and secure\n💰 You\'re charged only after placing the order\n\nYour payment info is never stored on our servers!';
  }

  return 'Thanks for reaching out! I\'m your SketchMint assistant and I can help with:\n\n• 💰 Pricing & styles\n• 🎨 Custom painting orders\n• 📦 Delivery times\n• 🔍 Order tracking\n• 🏷️ Discount codes\n\nWhat would you like to know about? 😊';
}

// @desc    Chat with AI assistant
// @route   POST /api/chatbot/message
export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ sessionId: sid });
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        user: req.user?._id || null,
        sessionId: sid,
        messages: [],
      });
    }

    // Build order context if user is logged in
    let orderContext = '';
    if (req.user) {
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('order') || lowerMsg.includes('track') || lowerMsg.includes('status') || lowerMsg.includes('where')) {
        try {
          const recentOrders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('orderNumber orderStatus paymentStatus totalAmount createdAt estimatedDelivery trackingNumber')
            .lean();

          const customOrders = await CustomOrder.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('orderNumber status paymentStatus totalAmount sketchStyle canvasSize estimatedDelivery')
            .lean();

          if (recentOrders.length > 0 || customOrders.length > 0) {
            orderContext = '\n\nThis customer\'s recent orders:\n';
            recentOrders.forEach(o => {
              orderContext += `- Artwork Order ${o.orderNumber}: Status=${o.orderStatus}, Payment=${o.paymentStatus}, Total=$${o.totalAmount}${o.trackingNumber ? `, Tracking=${o.trackingNumber}` : ''}\n`;
            });
            customOrders.forEach(o => {
              orderContext += `- Custom Order ${o.orderNumber}: Status=${o.status}, Style=${o.sketchStyle}, Size=${o.canvasSize}, Total=$${o.totalAmount}\n`;
            });
          }
        } catch (err) {
          console.error('Order context error:', err.message);
        }
      }
    }

    let assistantMessage;

    // Try AI first, fall back to keyword matching
    if (openai) {
      try {
        const aiMessages = [
          { role: 'system', content: SYSTEM_PROMPT + orderContext },
        ];

        // Add recent chat history (last 6 messages)
        const recentMessages = chatHistory.messages.slice(-6);
        recentMessages.forEach(m => {
          aiMessages.push({ role: m.role, content: m.content });
        });

        aiMessages.push({ role: 'user', content: message.trim() });

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: aiMessages,
          max_tokens: 400,
          temperature: 0.7,
        });

        assistantMessage = response.choices[0].message.content;
      } catch (aiError) {
        console.error('Chatbot AI error:', aiError.message);
        assistantMessage = getFallbackResponse(message);
      }
    } else {
      assistantMessage = getFallbackResponse(message);
    }

    // Save to history
    chatHistory.messages.push(
      { role: 'user', content: message.trim(), timestamp: new Date() },
      { role: 'assistant', content: assistantMessage, timestamp: new Date() }
    );

    // Keep only last 50 messages per session
    if (chatHistory.messages.length > 50) {
      chatHistory.messages = chatHistory.messages.slice(-50);
    }

    await chatHistory.save();

    res.json({
      success: true,
      message: assistantMessage,
      sessionId: sid,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I\'m having trouble right now. Please try again.',
    });
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