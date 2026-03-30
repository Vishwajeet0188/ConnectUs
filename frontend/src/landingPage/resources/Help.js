import React, { useState, useRef, useEffect } from "react";

function Help() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "support",
      text: "Hi 👋 I'm here to help. What's on your mind? You can share anything.",
      time: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (chatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatOpen]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Heartwarming thank you responses
  const thankYouResponses = [
    "💖 You're so welcome! Remember: You're stronger than you think. I believe in you! 🌟",
    "🌸 Thank YOU for sharing. Your courage inspires me. Keep going, amazing person! 💪",
    "💕 Aww, my pleasure! You've got this. The world is brighter with you in it! ✨",
    "🌼 You're doing great! Every small step counts. Proud of you for reaching out! 🦋",
    "💗 Thank you for being here. You matter more than you know. Sending you warm hugs! 🤗",
    "⭐️ You're awesome! Keep taking care of yourself. I'm always here if you need me! 💫",
    "💝 Your strength is beautiful! Never forget how incredible you are. You've got this! 🌈",
    "🌺 So sweet of you! Remember to be kind to yourself. You deserve all the happiness! 🎀",
    "💙 You're making progress every day. So proud of you! Keep shining bright! ✨",
    "🌸 Your journey matters. Thank you for letting me be part of it. You're doing amazing! 💖"
  ];

  // Simple responses for common issues
  const getResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Check for thank you messages
    if (msg.includes("thank") || msg.includes("thnx") || msg.includes("thanks") || msg.includes("appreciate")) {
      const randomResponse = thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)];
      return randomResponse;
    }
    
    // Sleep issues
    if (msg.includes("sleep") || msg.includes("tired") || msg.includes("can't sleep")) {
      return "😴 I hear you. Sleep issues are tough. Try: 📵 No screens 1hr before bed, 🧘 Deep breathing, ☕ Avoid caffeine after 3pm. Would you like more sleep tips? Remember, rest is important! 💙";
    }
    
    // Exam stress
    if (msg.includes("exam") || msg.includes("test") || msg.includes("study") || msg.includes("stress")) {
      return "📚 Exam stress is real! Remember: 🎯 Take 5-min breaks every 25 mins, 🥤 Stay hydrated, 😴 Get 7-8 hrs sleep. You've got this! 💪 You're more capable than you know! Need study tips?";
    }
    
    // Anxiety
    if (msg.includes("anxious") || msg.includes("anxiety") || msg.includes("nervous") || msg.includes("worried")) {
      return "🌿 Anxiety is challenging. Try this: 🌬️ Breathe in 4 sec, hold 4, out 4. Focus on one thing at a time. You're safe right now. Want to talk more? You're handling this so well! 💪";
    }
    
    // Loneliness
    if (msg.includes("lonely") || msg.includes("alone") || msg.includes("no one")) {
      return "💙 You're not alone - I'm here with you. Even small connections help: 📞 Call a friend, 👋 Join a club, 🐕 Visit a pet cafe. Want more ideas? You matter so much! 🌟";
    }
    
    // Sadness
    if (msg.includes("sad") || msg.includes("depress") || msg.includes("down")) {
      return "🌈 I'm sorry you're feeling this way. Small steps help: 🚶 Take a short walk, 🎵 Listen to uplifting music, 📝 Write down 1 good thing today. Here for you. 💙 Brighter days are ahead!";
    }
    
    // Overwhelmed
    if (msg.includes("overwhelm") || msg.includes("too much") || msg.includes("can't cope")) {
      return "🛑 When overwhelmed: 1️⃣ Stop and breathe deeply, 2️⃣ Pick ONE small task, 3️⃣ Do just that. You don't have to do everything at once. What's one thing you can do now? You're doing great! ✨";
    }
    
    // Motivation
    if (msg.includes("motivation") || msg.includes("procrastinate") || msg.includes("lazy")) {
      return "⚡ Lack of motivation is common! Try the 5-minute rule: Just start for 5 mins. Often you'll keep going. What's something small you can start with? You're capable of amazing things! 💪";
    }
    
    // Relationship issues
    if (msg.includes("friend") || msg.includes("relationship") || msg.includes("argu")) {
      return "💭 Relationships can be complicated. Remember: Listen first, speak calmly, take space if needed. Want to share what's going on? Your feelings are valid! 💖";
    }
    
    // Self-care
    if (msg.includes("self care") || msg.includes("take care") || msg.includes("feeling better")) {
      return "🌸 Self-care is so important! 🛀 Take a warm bath, 📖 Read a book, 🎨 Do something creative, 🧘 Meditate. What makes you feel good? You deserve to feel amazing! 💕";
    }
    
    // Accomplishment
    if (msg.includes("did it") || msg.includes("finished") || msg.includes("complete") || msg.includes("success")) {
      return "🎉 THAT'S AMAZING! I'm so proud of you! 👏 Celebrate this win - you earned it! Every achievement matters. What's next on your journey? You're unstoppable! 🌟";
    }
    
    // Default supportive response
    return "Thank you for sharing. Can you tell me a bit more about how you're feeling? I'm here to listen. 💙 You're doing something really brave by talking about this!";
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    
    // Add user message
    setMessages(prev => [...prev, { from: "user", text: text, time: new Date() }]);
    setInput("");
    setShowOptions(false);
    
    // Get and add support response after short delay
    setTimeout(() => {
      const response = getResponse(text);
      setMessages(prev => [...prev, { from: "support", text: response, time: new Date() }]);
    }, 500);
  };

  const handleQuickReply = (text) => {
    setInput(text);
    setTimeout(() => sendMessage(), 10);
  };

  const quickOptions = [
    { emoji: "😴", text: "Can't sleep well" },
    { emoji: "📚", text: "Exam stress" },
    { emoji: "😰", text: "Feeling anxious" },
    { emoji: "💔", text: "Feeling lonely" },
    { emoji: "😔", text: "Feeling sad" },
    { emoji: "🔄", text: "Feeling overwhelmed" },
  ];

  return (
    <div className="container mb-5 border-top">
      <div className="row mt-5 p-5">
        <h1 className="mb-5 text-center">Need Immediate Help?</h1>
      
        <div className="bg-white p-5 rounded-4 shadow-lg border border-danger border-opacity-25 mx-auto" style={{ maxWidth: "800px" }}>
          <h4 className="text-center text-danger mb-4">
            ⚠️ If this is a medical emergency, please call 911
          </h4>

          <div className="bg-light p-4 rounded-3 mb-4">
            <p className="fs-5 mb-3">🆘 CRISIS HOTLINE: <span className="text-danger fw-bold fs-4">988</span> (24/7)</p>
            <p className="fs-5 mb-3">📱 TEXT: <span className="text-danger fw-bold">HOME</span> to <span className="text-danger fw-bold">741741</span></p>
            <p className="fs-5 mb-0">🏥 Campus Counseling: <span className="text-danger fw-bold">(555) 123-4567</span></p>
          </div>

          <div className="text-center d-flex justify-content-center gap-3">
            <button 
              className="btn btn-danger rounded-pill px-4 py-2 fw-semibold"
              onClick={() => setChatOpen(!chatOpen)}
            >
              💬 Start Anonymous Chat
            </button>
            <button className="btn btn-outline-danger rounded-pill px-4 py-2 fw-semibold">
              📞 Call Now
            </button>
          </div>

          {/* Chat Panel */}
          {chatOpen && (
            <div className="mt-4 border rounded-3 overflow-hidden shadow-sm">
              {/* Chat Header */}
              <div className="bg-danger text-white p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-success rounded-pill" style={{ width: 10, height: 10 }}>&nbsp;</span>
                      <span className="fw-semibold">Anonymous Support 💙</span>
                    </div>
                    <small className="text-white-50">We're here to listen & support you</small>
                  </div>
                  <button 
                    className="btn btn-sm btn-light rounded-circle"
                    onClick={() => setChatOpen(false)}
                    style={{ width: 30, height: 30 }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ height: 400, overflowY: "auto" }} className="p-3 bg-light">
                {messages.map((msg, i) => (
                  <div key={i} className={`d-flex ${msg.from === "user" ? "justify-content-end" : "justify-content-start"} mb-3`}>
                    {msg.from === "support" && (
                      <div className="flex-shrink-0 me-2">
                        <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 32, height: 32, fontSize: 16 }}>
                          💙
                        </div>
                      </div>
                    )}
                    <div style={{ maxWidth: "75%" }}>
                      <div className={`p-3 rounded-3 ${msg.from === "user" ? "bg-danger text-white" : "bg-white border"}`}>
                        {msg.text}
                      </div>
                      <div className="text-muted small mt-1 px-2">
                        {msg.from === "support" ? "Support" : "You"} • {formatTime(msg.time)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Quick Options - Only show when conversation starts */}
              {showOptions && messages.length === 1 && (
                <div className="p-3 bg-white border-top">
                  <div className="text-muted small mb-2">Common concerns:</div>
                  <div className="d-flex flex-wrap gap-2">
                    {quickOptions.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(option.text)}
                        className="btn btn-sm btn-outline-secondary rounded-pill"
                      >
                        {option.emoji} {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white border-top">
                <div className="d-flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="form-control rounded-pill"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="btn btn-danger rounded-pill px-4"
                  >
                    Send
                  </button>
                </div>
                <small className="text-muted mt-2 d-block text-center">
                  💙 Your messages are anonymous • We're here to boost your spirits!
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Help;