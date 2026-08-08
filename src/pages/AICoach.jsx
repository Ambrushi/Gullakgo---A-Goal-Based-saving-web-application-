import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import SubscriptionModal from '../components/SubscriptionModal';

export default function AICoach() {
  const { 
    user, 
    goals, 
    expenses, 
    geminiApiKey, 
    saveGeminiApiKey, 
    getRemainingPrompts, 
    canSendAIPrompt, 
    incrementAIUsage 
  } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Namaste ${user.name.split(' ')[0]}! 🤖 I'm your GullakGo AI Financial Coach. Ask me anything about managing expenses, reaching your savings goals faster, or budgeting your pocket money!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [isLimitReachedModal, setIsLimitReachedModal] = useState(false);
  const [showKeyDrawer, setShowKeyDrawer] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState(geminiApiKey || '');

  const chatEndRef = useRef(null);
  const usageInfo = getRemainingPrompts();

  const activeGoals = goals.filter(g => g.status === 'active');
  const primaryGoalTitle = activeGoals.length > 0 ? activeGoals[0].title : 'PlayStation 5';

  const suggestedQuestions = [
    `How can I reach my "${primaryGoalTitle}" goal faster? 🎯`,
    "Analyze my recent spending habits & snacks 📊",
    "What is the 50/30/20 rule for teens? 💡",
    `How do I protect my ${user.globalStreak}-day streak? 🔥`
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Call Gemini REST API if Key is present, with detailed error feedback
  const fetchGeminiAIResponse = async (userQuery) => {
    // Resolve key from state or env
    let apiKey = (geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || '').trim();
    // Clean potential quotes
    apiKey = apiKey.replace(/^["']|["']$/g, '');

    if (!apiKey) {
      return (
        generateFallbackAIResponse(userQuery) +
        '\n\n*(💡 Note: No Gemini API Key found in .env or settings drawer. Using offline coach fallback)*'
      );
    }

    try {
      const activeGoalsStr = goals
        .filter(g => g.status === 'active')
        .map(g => `${g.title}: saved ₹${g.currentAmount} out of ₹${g.targetAmount}`)
        .join('; ');
      
      const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

      const systemPrompt = `You are GullakGo AI Financial Coach, an enthusiastic, smart, and encouraging financial advisor for teenagers and students.
User Details: Name: ${user.name}, Total Savings: ₹${user.totalSaved}, Global Streak: ${user.globalStreak} days.
Active Goals: ${activeGoalsStr || 'No active goals yet'}.
Recent Monthly Spend: ₹${totalSpent}.

Instructions:
1. Provide actionable, concise, and teen-friendly advice using emojis and markdown.
2. Adapt calculations in Indian Rupees (₹) and pocket-money budget scales.
3. If user says 'hi' or greets you, greet them back warmly by name as GullakGo AI Coach and ask how you can help with their savings or budget today!`;

      const historyStr = messages
        .slice(-6)
        .map(m => `${m.sender === 'user' ? 'User' : 'Coach'}: ${m.text}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}\n\nRecent Conversation History:\n${historyStr}\n\nUser Question: ${userQuery}\n\nCoach Answer:`;

      // Free Tier Gemini Models array (falls back sequentially if one is busy/rate-limited)
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-8b'];
      let lastErrorMsg = '';
      let isRateLimited = false;

      for (const model of modelsToTry) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: fullPrompt }]
                  }
                ]
              })
            }
          );

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 429) {
              isRateLimited = true;
              lastErrorMsg = 'Gemini API Rate Limit / Quota Exceeded (429). Free tier requests are temporarily throttled.';
            } else if (response.status === 400 && data.error?.message?.includes('API key')) {
              lastErrorMsg = `Invalid Gemini API Key format (${data.error.message}). Real Google AI Studio keys start with 'AIzaSy...'.`;
            } else {
              const apiErrMsg = data.error?.message || response.statusText || 'Unknown API Error';
              lastErrorMsg = `Gemini API (${model}) Error ${response.status}: ${apiErrMsg}`;
            }
            console.warn(lastErrorMsg);
            continue; // try next model
          }

          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) {
            return aiText;
          }
        } catch (mErr) {
          lastErrorMsg = mErr.message;
        }
      }

      // Format user-friendly error banner
      const userFriendlyError = isRateLimited
        ? `⚡ **Gemini API Rate Limit / Quota Exceeded**\nYour Google Gemini API Key has hit its temporary rate limit (Error 429). Please wait ~45 seconds before trying again, or enter a new API Key.`
        : `⚠️ **Gemini API Error:**\n\`${lastErrorMsg}\`\n\nPlease check your API key in your \`.env\` file or click **🔑 Add Gemini Key** to update it.`;

      return (
        `${userFriendlyError}\n\n` +
        `---\n\n` +
        generateFallbackAIResponse(userQuery)
      );
    } catch (err) {
      console.warn('Gemini API fetch exception:', err);
      return (
        `⚠️ **Connection Error:** Could not reach Gemini API (${err.message}).\n\n` +
        generateFallbackAIResponse(userQuery)
      );
    }
  };

  // Intelligent Fallback Generator
  const generateFallbackAIResponse = (userQuery) => {
    const query = userQuery.toLowerCase().trim();
    const activeGoals = goals.filter(g => g.status === 'active');
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    if (['hi', 'hello', 'hey', 'namaste', 'hallo'].includes(query) || query.startsWith('hi ') || query.startsWith('hello ')) {
      return `Hey ${user.name.split(' ')[0]}! 👋 🤖\n\nI'm ready to help you hit your savings goals and manage your pocket money! You can ask me:\n• "How do I reach my goals faster?"\n• "Analyze my recent expenses"\n• "Explain the 50/30/20 budgeting rule"`;
    }

    if (query.includes('weekly') || query.includes('plan') || query.includes('savings') || query.includes('saving')) {
      if (activeGoals.length > 0) {
        const goalsBreakdown = activeGoals.map(g => {
          const remaining = Math.max(0, g.targetAmount - g.currentAmount);
          const weeklyNeed = Math.ceil(remaining / 4); // target over 4 weeks
          return `• **${g.title}**: Save **₹${weeklyNeed.toLocaleString('en-IN')}/week** (Saved: ₹${g.currentAmount.toLocaleString('en-IN')} / Target: ₹${g.targetAmount.toLocaleString('en-IN')})`;
        }).join('\n');

        const totalWeekly = activeGoals.reduce((sum, g) => {
          const remaining = Math.max(0, g.targetAmount - g.currentAmount);
          return sum + Math.ceil(remaining / 4);
        }, 0);

        return `🗓️ **Personalized Weekly Savings Plan for ${user.name.split(' ')[0]}:**\n\nTo hit your active goals over the next 4 weeks, here is your target breakdown:\n\n${goalsBreakdown}\n\n💰 **Total Weekly Savings Target:** **₹${totalWeekly.toLocaleString('en-IN')}/week** (approx. ₹${Math.ceil(totalWeekly / 7).toLocaleString('en-IN')}/day)\n\n💡 **Coach Tip:** Log at least ₹50 daily to maintain your **${user.globalStreak}-day streak** 🔥 and keep building your total savings of **₹${user.totalSaved.toLocaleString('en-IN')}**!`;
      }
    }

    if (query.includes('ps5') || query.includes('goal faster') || query.includes('reach')) {
      if (activeGoals.length > 0) {
        const topGoal = activeGoals[0];
        const remaining = topGoal.targetAmount - topGoal.currentAmount;
        const dailyNeeded = Math.ceil(remaining / 30);
        return `I looked at your active goal **"${topGoal.title}"**! You have saved **₹${topGoal.currentAmount.toLocaleString('en-IN')}** out of **₹${topGoal.targetAmount.toLocaleString('en-IN')}** (${Math.round((topGoal.currentAmount/topGoal.targetAmount)*100)}% complete).\n\n💡 **Coach Tip:** If you save just **₹${dailyNeeded.toLocaleString('en-IN')}/day** for the next 30 days, you will reach your target effortlessly! Consider linking your parent for deposit matching! 🎁`;
      }
      return `To reach your goals faster:\n1. Cut unnecessary daily snack spends by ₹50/day.\n2. Enable the **Lock-In period** to prevent impulsive payouts.\n3. Keep your **${user.globalStreak}-day streak** active for bonus levels! 🔥`;
    }

    if (query.includes('spending') || query.includes('expense') || query.includes('habits') || query.includes('analyze')) {
      if (expenses.length > 0) {
        const topCategory = expenses[0].category;
        return `📊 **Spending Analysis for ${user.name.split(' ')[0]}:**\nTotal spent this month: **₹${totalSpent.toLocaleString('en-IN')}** across ${expenses.length} logs.\nYour biggest expense area is **${topCategory}**.\n\n💡 **Coach Recommendation:** Try setting a weekly limit of ₹300 for ${topCategory}. Saving the leftover money into your goals will boost your streak! 🚀`;
      }
      return `You haven't logged many expenses yet! Go to the **Expense Tracker** to log your daily drinks, snacks, or gaming passes. I'll analyze your spending breakdown automatically! 📈`;
    }

    if (query.includes('spiderman') || query.includes('spider-man') || query.includes('movie') || query.includes('pune')) {
      return `🎟️ **Spider-Man Movie Gullak Plan (Pune):**\n\n• **Estimated Budget:** ~₹600 (IMAX / PVR ticket ₹350 + Popcorn & Drink ₹250)\n• **Timeframe:** 4 Days\n• **Daily Savings Target:** **₹150 / day** for the next 4 days!\n\n💡 **Coach Recommendation:** Head over to the **Goal Creation** page (` + "`/goals/new`" + `) and create a new goal named **"Spider-Man Movie in Pune"** with target **₹600**. Deposit ₹150 daily to hit your goal on time! 🍿🎬`;
    }

    if (query.includes('50/30/20') || (query.includes('rule') && query.includes('budget'))) {
      return `💡 **The 50/30/20 Rule adapted for Gen-Z & Students:**\n\n• **50% Needs**: School supplies, travel fare, essential books.\n• **30% Wants**: Gaming passes, boba tea, movie tickets with friends.\n• **20% Gullak Savings**: Direct into your GullakGo savings goals! 🎯\n\nFollowing this simple formula ensures you enjoy today while building your dream savings for tomorrow! ✨`;
    }

    if (query.includes('streak') || query.includes('flame') || query.includes('alive')) {
      return `🔥 **Streak Masterclass:**\nYour current streak is **${user.globalStreak} Days**!\n\nTo keep it alive:\n1. Top up at least ₹50 daily on any active goal.\n2. Enable daily reminders so you never miss a day.\n3. Reaching a 10-day streak unlocks special Level Badges! 🏆`;
    }

    return `Great question! Here is my advice as your GullakGo AI Coach:\n\n1. **Track Small Amounts:** Every ₹20 or ₹50 saved counts towards your big goal.\n2. **Parent Sponsorship:** Talk to your guardian about matching your weekly savings.\n3. **Stay Disciplined:** You currently have **₹${user.totalSaved.toLocaleString('en-IN')}** stashed. Keep building that financial muscle! 💪`;
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Check prompt restriction
    if (!canSendAIPrompt()) {
      setIsLimitReachedModal(true);
      setShowSubModal(true);
      return;
    }

    // Deduct / increment prompt count
    incrementAIUsage();

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const aiResponseText = await fetchGeminiAIResponse(text);

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleSaveApiKey = () => {
    saveGeminiApiKey(tempKeyInput);
    setShowKeyDrawer(false);
  };

  return (
    <div className="container py-4" style={{ maxWidth: '850px' }}>
      
      {/* Header & Usage Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-3 rounded-4 bg-white shadow-sm border">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded-circle p-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', width: '52px', height: '52px', fontSize: '1.7rem' }}
          >
            🤖
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h2 className="brand-font mb-0 text-dark fs-4">GullakGo AI Coach</h2>
              <span className="badge rounded-pill text-white fw-bold px-2 py-1" style={{ backgroundColor: usageInfo.plan.color, fontSize: '0.65rem' }}>
                {usageInfo.plan.name}
              </span>
            </div>
            <p className="text-secondary small mb-0">Powered by Gemini AI • Pocket-friendly financial guidance</p>
          </div>
        </div>

        {/* Prompt Usage Badge & Upgrade Button */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button 
            className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 text-nowrap"
            onClick={() => setShowKeyDrawer(!showKeyDrawer)}
            title="Configure Gemini API Key"
          >
            🔑 {geminiApiKey ? 'Gemini Key Saved' : 'Add Gemini Key'}
          </button>

          <div 
            className={`badge rounded-pill px-3 py-2 border d-flex align-items-center gap-1 ${
              usageInfo.remaining === 0 ? 'bg-danger text-white' : 'bg-light text-dark'
            }`}
            style={{ fontSize: '0.8rem' }}
          >
            <span>⚡ Prompts Left:</span>
            <span className="fw-bold">{usageInfo.remaining} / {usageInfo.limit}</span>
          </div>

          <button
            className="btn btn-sm text-white fw-bold rounded-pill px-3 py-1 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}
            onClick={() => {
              setIsLimitReachedModal(false);
              setShowSubModal(true);
            }}
          >
            Upgrade Plan 🚀
          </button>
        </div>
      </div>

      {/* Gemini API Key Collapsible Drawer */}
      {showKeyDrawer && (
        <div className="p-3 mb-4 bg-purple-subtle border border-purple rounded-4 style-key-drawer">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h6 className="fw-bold mb-0">⚙️ Gemini API Configuration</h6>
            <button className="btn-close btn-sm" onClick={() => setShowKeyDrawer(false)}></button>
          </div>
          <p className="small text-muted mb-2">
            Enter your Google Gemini API key to enable live AI generated answers directly from Gemini 1.5 Flash. If blank, our smart Gullak Coach logic will answer.
          </p>
          <div className="input-group">
            <input
              type="password"
              className="form-control rounded-start-pill border"
              placeholder="AIzaSy..."
              value={tempKeyInput}
              onChange={e => setTempKeyInput(e.target.value)}
            />
            <button className="btn btn-purple text-white rounded-end-pill px-4" onClick={handleSaveApiKey} style={{ backgroundColor: '#8B5CF6' }}>
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Limit Warning Banner when 0 prompts left */}
      {usageInfo.remaining === 0 && (
        <div className="alert alert-warning border-0 shadow-sm rounded-4 d-flex align-items-center justify-content-between p-3 mb-4">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4">🔒</span>
            <div>
              <strong className="d-block">Daily Prompt Limit Reached ({usageInfo.limit}/{usageInfo.limit})</strong>
              <span className="small text-muted">Upgrade to Daily (₹10), Weekly (₹49), or Monthly (₹149) pass for more prompts today!</span>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-dark rounded-pill px-3 py-2 text-nowrap fw-bold"
            onClick={() => {
              setIsLimitReachedModal(true);
              setShowSubModal(true);
            }}
          >
            Unlock Now ⚡
          </button>
        </div>
      )}

      {/* Chat Container */}
      <div className="stash-card d-flex flex-column" style={{ height: '540px' }}>
        {/* Messages Body */}
        <div className="flex-grow-1 p-3 p-md-4 overflow-y-auto custom-chat-scroll d-flex flex-column gap-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`d-flex gap-2 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="rounded-circle p-2 text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '36px', height: '36px', backgroundColor: '#8B5CF6' }}>
                  🤖
                </div>
              )}
              <div 
                className={`p-3 rounded-4 style-msg ${msg.sender === 'user' ? 'bg-purple text-white' : 'bg-light text-dark border'}`}
                style={{
                  maxWidth: '82%',
                  backgroundColor: msg.sender === 'user' ? '#8B5CF6' : undefined,
                  whiteSpace: 'pre-line'
                }}
              >
                <div className="fw-normal small">{msg.text}</div>
                <div className={`text-end mt-1 ${msg.sender === 'user' ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="d-flex align-items-center gap-2 text-muted small p-2">
              <div className="spinner-grow spinner-grow-sm text-purple" role="status" style={{ color: '#8B5CF6' }}></div>
              <span>GullakGo AI Coach (Gemini API) is thinking & typing...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-3 py-2 bg-light border-top d-flex gap-2 overflow-x-auto hide-scrollbar">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              className="btn btn-sm btn-outline-purple text-nowrap rounded-pill px-3 py-1 shadow-sm"
              style={{ fontSize: '0.8rem' }}
              onClick={() => handleSend(q)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="p-3 border-top bg-transparent d-flex align-items-center gap-2"
        >
          <input
            type="text"
            className="form-control rounded-pill fs-6 px-4"
            style={{ height: '46px' }}
            placeholder={usageInfo.remaining === 0 ? "Prompt limit reached for today! Upgrade to ask..." : "Ask about savings, budgeting rules, or cutting expenses..."}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn btn-stash-primary rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0" 
            style={{ width: '46px', height: '46px', border: 'none' }}
            title="Send Message"
          >
            <i className="bi bi-send-fill fs-5"></i>
          </button>
        </form>
      </div>

      {/* Subscription Modal Component */}
      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        isLimitReached={isLimitReachedModal}
      />
    </div>
  );
}
