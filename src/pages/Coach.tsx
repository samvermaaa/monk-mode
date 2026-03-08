import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Trophy, BarChart3, MessageCircle, Send } from 'lucide-react';

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

const MOCK_RESPONSES = [
  "I hear you. Remember — every urge is a test, not a command. You have full control over your actions. Let's breathe through this together. What triggered this feeling?",
  "You're stronger than you think. The fact that you're here talking instead of giving in proves that. What's one thing you can do right now to redirect your energy?",
  "Relapses don't erase progress. They're data points. What matters is that you're back. Let's figure out what triggered it and build a defense for next time.",
  "That's completely normal to feel that way. The brain is rewiring itself — discomfort means growth. Stay with it. What's your streak at right now?",
];

export default function Coach() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Mock AI response
    setTimeout(() => {
      const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1200);
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
            <p className="text-xs text-muted-foreground">Always here for you</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto container py-4 space-y-4 pb-36">
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
              Thinking...
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
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center disabled:opacity-50"
          >
            <Send className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border">
        <div className="container flex justify-around py-3">
          {[
            { icon: Flame, label: 'Dashboard', path: '/dashboard' },
            { icon: Trophy, label: 'Badges', path: '/achievements' },
            { icon: BarChart3, label: 'Analytics', path: '/analytics' },
            { icon: MessageCircle, label: 'AI Coach', path: '/coach' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 text-xs ${
                item.path === '/coach' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
