import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @desc    Analyze image and suggest sketch styles
// @route   POST /api/ai/suggest-style
export const suggestStyle = async (req, res) => {
  try {
    const { imageUrl, imageBase64 } = req.body;

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const imageContent = imageUrl
      ? { type: 'image_url', image_url: { url: imageUrl, detail: 'low' } }
      : { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: 'low' } };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert art advisor for SketchMint, an online custom painting platform. Analyze the uploaded image and suggest the best sketch/painting styles. Return a JSON array of suggestions.

Each suggestion should have:
- "style": one of ["pencil-sketch", "charcoal-sketch", "watercolor", "oil-painting", "digital-illustration", "line-art", "pop-art", "caricature", "realistic", "abstract"]
- "confidence": a number between 0 and 1
- "reason": a brief explanation (max 100 chars)

Return the top 3-5 best matching styles sorted by confidence. Return ONLY the JSON array, no other text.`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Please analyze this image and suggest the best sketch/painting styles for it.' },
            imageContent,
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    let suggestions;
    try {
      const content = response.choices[0].message.content.trim();
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      suggestions = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      // Fallback suggestions
      suggestions = [
        { style: 'pencil-sketch', confidence: 0.85, reason: 'Classic choice that works well with most images' },
        { style: 'watercolor', confidence: 0.75, reason: 'Adds a soft, artistic feel' },
        { style: 'digital-illustration', confidence: 0.70, reason: 'Modern and vibrant option' },
        { style: 'charcoal-sketch', confidence: 0.65, reason: 'Dramatic and expressive' },
        { style: 'realistic', confidence: 0.60, reason: 'True to life representation' },
      ];
    }

    res.json({ success: true, suggestions });
  } catch (error) {
    // Fallback when AI is unavailable
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return res.json({
        success: true,
        suggestions: [
          { style: 'pencil-sketch', confidence: 0.85, reason: 'Classic and timeless choice' },
          { style: 'watercolor', confidence: 0.78, reason: 'Beautiful soft tones' },
          { style: 'digital-illustration', confidence: 0.72, reason: 'Modern and clean' },
          { style: 'charcoal-sketch', confidence: 0.68, reason: 'Bold and dramatic' },
          { style: 'oil-painting', confidence: 0.60, reason: 'Rich and textured' },
        ],
        isDefault: true,
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};