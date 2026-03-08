import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/BottomNav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: "Welcome, warrior. I'm your MonkMode coach. I'm here to help you stay disciplined, manage urges, and build a stronger mindset. What's on your mind?",
  },
];

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { messages: newMessages.map(m => ({ role: m.role, content: m.content })) },
      });

      if (error) throw error;
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Coach error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Take a deep breath — you've got this. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      {/* Header */}
      <div className="container py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">AI Coach</h1>
            <p className="text-xs text-muted-foreground">Powered by AI • Always here for you</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto container py-4 space-y-4 pb-36">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card border border-border rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 text-sm text-muted-foreground">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border p-4">
        <div className="container flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
            aria-label="Chat message"
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
