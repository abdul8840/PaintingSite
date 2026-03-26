import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiChat, HiX, HiPaperAirplane } from 'react-icons/hi';
import { toggleChat, addUserMessage, sendChatMessage } from '../../store/slices/chatSlice';

export default function ChatBot() {
  const dispatch = useDispatch();
  const { isOpen, messages, loading, sessionId } = useSelector((state) => state.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    dispatch(addUserMessage(msg));
    dispatch(sendChatMessage({ message: msg, sessionId }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button onClick={() => dispatch(toggleChat())}>
          <HiChat />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div>
          {/* Header */}
          <div>
            <div>
              <h3>SketchMint Assistant</h3>
              <p>Ask me anything!</p>
            </div>
            <button onClick={() => dispatch(toggleChat())}><HiX /></button>
          </div>

          {/* Messages */}
          <div>
            {messages.length === 0 && (
              <div>
                <p>Hi! I'm your SketchMint assistant. How can I help you today?</p>
                <div>
                  {['What are the pricing options?', 'How long does delivery take?', 'Tell me about custom paintings'].map((q) => (
                    <button key={q} onClick={() => { dispatch(addUserMessage(q)); dispatch(sendChatMessage({ message: q, sessionId })); }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} data-role={msg.role}>
                <p>{msg.content}</p>
              </div>
            ))}

            {loading && (
              <div data-role="assistant">
                <p>Typing...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={!input.trim() || loading}>
              <HiPaperAirplane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}