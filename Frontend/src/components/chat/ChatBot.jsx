import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiChat, HiX, HiPaperAirplane } from 'react-icons/hi';
import {
  toggleChat,
  addUserMessage,
  sendChatMessage,
} from '../../store/slices/chatSlice';

export default function ChatBot() {
  const dispatch = useDispatch();
  const { isOpen, messages, loading, sessionId } = useSelector(
    (state) => state.chat
  );
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    dispatch(addUserMessage(msg));
    dispatch(sendChatMessage({ message: msg, sessionId }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'What are the pricing options?',
    'How long does delivery take?',
    'Tell me about custom paintings',
  ];

  return (
    <>
      {/* ======== Floating Toggle Button ======== */}
      {!isOpen && (
        <button
          onClick={() => dispatch(toggleChat())}
          className="
            fixed bottom-6 right-6 z-[100]
            w-14 h-14 rounded-2xl
            bg-ink text-paper
            flex items-center justify-center
            shadow-xl shadow-ink/20
            hover:bg-charcoal hover:scale-105
            transition-all duration-300 cursor-pointer
            active:scale-95
            animate-scale-in
            group
          "
          aria-label="Open chat"
        >
          <HiChat className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />

          {/* Pulse ring */}
          <span
            className="
              absolute inset-0 rounded-2xl
              border-2 border-ink/30
              animate-ping
              opacity-30
            "
          />
        </button>
      )}

      {/* ======== Chat Window ======== */}
      {isOpen && (
        <div
          className="
            fixed
            bottom-0 right-0 sm:bottom-6 sm:right-6
            z-[100]
            w-full sm:w-[380px] md:w-[400px]
            h-full sm:h-[540px] sm:max-h-[80vh]
            bg-paper
            sm:rounded-2xl
            shadow-2xl shadow-ink/15
            border-0 sm:border border-cream
            flex flex-col
            overflow-hidden
            animate-scale-in origin-bottom-right
          "
        >
          {/* ---- Header ---- */}
          <div
            className="
              flex items-center justify-between
              px-4 sm:px-5 py-3.5
              bg-ink text-paper
              shrink-0
            "
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="
                  w-9 h-9 rounded-xl
                  bg-rust/20
                  flex items-center justify-center
                "
              >
                <HiChat className="w-4.5 h-4.5 text-rust" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">
                  SketchMint Assistant
                </h3>
                <p className="text-[10px] text-paper/50 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                  Online — Ask me anything!
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleChat())}
              className="
                p-2 rounded-xl
                text-paper/60 hover:text-paper hover:bg-paper/10
                transition-all duration-300 cursor-pointer
                active:scale-90
              "
              aria-label="Close chat"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* ---- Messages ---- */}
          <div
            className="
              flex-1 overflow-y-auto
              px-4 sm:px-5 py-4
              space-y-3
              bg-cream/20
              scrollbar-none
            "
          >
            {/* Welcome / Empty State */}
            {messages.length === 0 && (
              <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                {/* Bot Welcome */}
                <div className="flex gap-2.5 mb-4">
                  <div
                    className="
                      w-7 h-7 rounded-lg
                      bg-ink
                      flex items-center justify-center
                      shrink-0 mt-0.5
                    "
                  >
                    <HiChat className="w-3.5 h-3.5 text-paper" />
                  </div>
                  <div
                    className="
                      max-w-[80%]
                      px-3.5 py-2.5 rounded-2xl rounded-tl-md
                      bg-paper border border-cream
                      text-sm text-charcoal leading-relaxed
                      shadow-sm
                    "
                  >
                    Hi! 👋 I'm your SketchMint assistant. How can I help you
                    today?
                  </div>
                </div>

                {/* Quick Questions */}
                <div className="pl-9 space-y-2">
                  <p className="text-[10px] text-mist uppercase tracking-wider font-semibold mb-2">
                    Quick questions
                  </p>
                  {quickQuestions.map((q, i) => (
                    <button
                      key={q}
                      onClick={() => {
                        dispatch(addUserMessage(q));
                        dispatch(sendChatMessage({ message: q, sessionId }));
                      }}
                      className="
                        block w-full text-left
                        px-3 py-2 rounded-xl
                        bg-paper border border-cream
                        text-xs text-charcoal font-medium
                        hover:border-rust/30 hover:text-rust hover:bg-rust/5
                        transition-all duration-300 cursor-pointer
                        active:scale-[0.98]
                        animate-fade-in-up opacity-0
                      "
                      style={{
                        animationDelay: `${(i + 1) * 0.1}s`,
                        animationFillMode: 'forwards',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Bubbles */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`
                  flex gap-2.5
                  animate-fade-in-up
                  ${msg.role === 'user' ? 'justify-end' : 'justify-start'}
                `}
                style={{ animationFillMode: 'forwards' }}
              >
                {/* Bot Avatar */}
                {msg.role === 'assistant' && (
                  <div
                    className="
                      w-7 h-7 rounded-lg
                      bg-ink
                      flex items-center justify-center
                      shrink-0 mt-0.5
                    "
                  >
                    <HiChat className="w-3.5 h-3.5 text-paper" />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`
                    max-w-[78%]
                    px-3.5 py-2.5
                    text-sm leading-relaxed
                    shadow-sm
                    ${
                      msg.role === 'user'
                        ? 'bg-ink text-paper rounded-2xl rounded-tr-md'
                        : 'bg-paper border border-cream text-charcoal rounded-2xl rounded-tl-md'
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-2.5 animate-fade-in">
                <div
                  className="
                    w-7 h-7 rounded-lg
                    bg-ink
                    flex items-center justify-center
                    shrink-0 mt-0.5
                  "
                >
                  <HiChat className="w-3.5 h-3.5 text-paper" />
                </div>
                <div
                  className="
                    px-4 py-3 rounded-2xl rounded-tl-md
                    bg-paper border border-cream
                    shadow-sm
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-mist animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-mist animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-mist animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ---- Input ---- */}
          <div
            className="
              shrink-0
              px-4 sm:px-5 py-3
              border-t border-cream
              bg-paper
            "
          >
            <div
              className="
                flex items-center gap-2
                bg-cream/50 rounded-xl
                border border-cream
                focus-within:border-rust/40
                focus-within:shadow-md focus-within:shadow-rust/5
                transition-all duration-300
                overflow-hidden
                pr-1.5
              "
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={loading}
                className="
                  flex-1
                  px-4 py-2.5
                  bg-transparent
                  text-sm text-ink
                  placeholder:text-mist
                  focus:outline-none
                  disabled:opacity-50
                "
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="
                  w-8 h-8 rounded-lg
                  bg-ink text-paper
                  flex items-center justify-center
                  hover:bg-charcoal
                  disabled:opacity-30 disabled:cursor-not-allowed
                  disabled:hover:bg-ink
                  transition-all duration-300 cursor-pointer
                  active:scale-90
                  shrink-0
                "
                aria-label="Send message"
              >
                <HiPaperAirplane
                  className="
                    w-3.5 h-3.5
                    rotate-90
                  "
                />
              </button>
            </div>

            {/* Powered by note */}
            <p className="text-center text-[9px] text-mist/60 mt-2 select-none">
              Powered by SketchMint AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}