import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export default function GoalDetail() {
  const { id } = useParams();
  const { goals, addContribution } = useApp();

  const goal = goals.find(g => g.id === id);

  // Quick contribute modal state
  const [showModal, setShowModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [note, setNote] = useState('');
  const [payNotice, setPayNotice] = useState(false);

  if (!goal) {
    return (
      <div className="container text-center py-5">
        <h4>Goal not found! 🔍</h4>
        <Link to="/" className="btn btn-stash-primary mt-3">Return to Dashboard</Link>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  // Circular progress calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleQuickAdd = (amount) => {
    addContribution(goal.id, amount, 'Daily Streak Contribution 🔥');
    triggerConfetti();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customAmount) return;
    addContribution(goal.id, parseFloat(customAmount), note || 'Custom Top-up 💰');
    triggerConfetti();
    setShowModal(false);
    setCustomAmount('');
    setNote('');
  };

  const handlePayNow = () => {
    setPayNotice(true);
    triggerConfetti();
    setTimeout(() => setPayNotice(false), 6000);
  };

  return (
    <div className="container py-4" style={{ maxWidth: '720px' }}>
      {/* Top Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <Link to="/" className="btn btn-sm btn-stash-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
          <i className="bi bi-arrow-left fs-5"></i>
        </Link>
        <span className="badge bg-purple-subtle px-3 py-1 rounded-pill fw-bold">
          {goal.category} Gullak
        </span>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Main Goal Card with Circular Progress */}
      <div className="stash-card p-4 p-md-5 mb-4 text-center">
        
        {/* Streak & Status Row */}
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 mb-3">
          <div className="streak-badge">
            <i className="bi bi-fire text-warning"></i> {goal.streak} Day Streak
          </div>
          {pct >= 25 && <span className="badge bg-purple text-white rounded-pill px-3 py-2" style={{ backgroundColor: '#8B5CF6' }}>🌱 25% Starter</span>}
          {pct >= 50 && <span className="badge bg-warning text-dark rounded-pill px-3 py-2">🎯 50% Halfway Hero</span>}
          {pct >= 75 && <span className="badge bg-info text-white rounded-pill px-3 py-2">⚡ 75% Almost There</span>}
          {pct >= 100 && <span className="badge bg-success text-white rounded-pill px-3 py-2">🏆 Goal Conquered!</span>}
          {goal.lockIn && (
            <span className="badge bg-dark text-white rounded-pill px-3 py-2">
              <i className="bi bi-lock-fill me-1"></i> Locked In
            </span>
          )}
        </div>

        <h2 className="brand-font display-6 text-dark mb-4">{goal.title}</h2>

        {/* Animated Circular SVG Progress Ring */}
        <div className="circle-progress-wrapper mb-4">
          <svg className="circle-progress-svg" width="180" height="180">
            <defs>
              <linearGradient id="gradientCircle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <circle className="circle-bg" cx="90" cy="90" r={radius} />
            <circle
              className="circle-meter"
              cx="90"
              cy="90"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="circle-text">
            <span className="brand-font display-6 fw-bold text-dark">{pct}%</span>
            <div className="text-secondary small fw-semibold">Saved</div>
          </div>
        </div>

        {/* Money Figures in INR (₹) */}
        <div className="row g-2 justify-content-center mb-4">
          <div className="col-5 bg-light p-3 rounded-4">
            <div className="text-secondary small fw-semibold">Saved So Far</div>
            <div className="brand-font fs-3 text-purple">₹{goal.currentAmount.toLocaleString('en-IN')}</div>
          </div>
          <div className="col-5 bg-light p-3 rounded-4">
            <div className="text-secondary small fw-semibold">Target Goal</div>
            <div className="brand-font fs-3 text-dark">₹{goal.targetAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Quick Contribute Quick Buttons */}
        <div className="mb-4">
          <label className="form-label text-secondary small fw-semibold d-block mb-2">
            Quick Add to Keep Streak Alive 🔥
          </label>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            {[100, 250, 500, 1000].map(amt => (
              <button
                key={amt}
                className="btn btn-outline-purple rounded-pill px-3 py-2 fw-bold"
                onClick={() => handleQuickAdd(amt)}
              >
                +₹{amt}
              </button>
            ))}
            <button
              className="btn btn-stash-secondary rounded-pill px-3 py-2"
              onClick={() => setShowModal(true)}
            >
              Custom +
            </button>
          </div>
        </div>

        {/* Primary Action Buttons: Pay Now & Add to Streak */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button
            className="btn btn-stash-primary flex-grow-1 py-3 fs-6 d-flex align-items-center justify-content-center gap-2"
            onClick={() => handleQuickAdd(500)}
          >
            <i className="bi bi-fire fs-5"></i> Add to Streak (+₹500)
          </button>
          
          <button
            className="btn btn-stash-teal flex-grow-1 py-3 fs-6 d-flex align-items-center justify-content-center gap-2"
            onClick={handlePayNow}
          >
            <i className="bi bi-credit-card-fill fs-5"></i> Pay Now (UPI / Card)
          </button>
        </div>

        {/* Pay Now Non-functional Demo Alert */}
        {payNotice && (
          <div className="alert alert-info border-0 rounded-4 mt-3 mb-0 text-start d-flex align-items-center gap-3">
            <i className="bi bi-info-circle-fill fs-3 text-purple"></i>
            <div>
              <strong className="d-block">UPI / NetBanking Payment Gateway Coming Soon! 💳</strong>
              <small className="text-secondary">
                The "Pay Now" feature will seamlessly connect to UPI apps (Google Pay, PhonePe, Paytm) once integrated!
              </small>
            </div>
          </div>
        )}
      </div>

      {/* Contribution Timeline History Card */}
      <div className="stash-card p-4">
        <h4 className="brand-font mb-3 text-dark d-flex align-items-center gap-2">
          <i className="bi bi-clock-history text-purple"></i> Contribution History
        </h4>

        {goal.contributions.length === 0 ? (
          <p className="text-muted text-center py-3">No contributions logged yet. Add your first top-up!</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {goal.contributions.map((c, i) => (
              <div key={c.id || i} className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-light border-start border-4 border-purple" style={{ borderLeftColor: '#8B5CF6' }}>
                <div>
                  <div className="fw-bold text-dark">{c.note || 'Contribution'}</div>
                  <div className="text-muted small">{c.date}</div>
                </div>
                <span className="brand-font fs-5 text-success font-bold">+₹{c.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Add Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title brand-font">Add Custom Contribution 💰</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCustomSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-semibold">Amount (₹)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control form-control-lg rounded-3"
                      placeholder="e.g. 500"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-semibold">Note / Source</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Festival gift money 🧧"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-stash-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-stash-primary">Add Contribution 🎉</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
