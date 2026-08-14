import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import UPIPaymentModal from '../components/UPIPaymentModal';

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goals, addContribution, updateGoal, deleteGoal, calculateDailySavingRate, recordPayment } = useApp();

  const goal = goals.find(g => g.id === id);

  // Quick contribute modal state
  const [showModal, setShowModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [note, setNote] = useState('');

  // UPI Payment Modal State
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiPayAmount, setUpiPayAmount] = useState(0);

  // Edit / Customize Goal modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTargetAmount, setEditTargetAmount] = useState('');
  const [editTargetDate, setEditTargetDate] = useState('');
  const [editDailySavingRate, setEditDailySavingRate] = useState('');
  const [editLockIn, setEditLockIn] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!goal) {
    return (
      <div className="container text-center py-5">
        <h4>Goal not found! 🔍</h4>
        <Link to="/" className="btn btn-stash-primary mt-3">Return to Dashboard</Link>
      </div>
    );
  }

  const effectiveDailyRate = goal.dailySavingRate || calculateDailySavingRate(goal.targetAmount, goal.currentAmount, goal.targetDate);
  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  // Circular progress calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 }
    });
  };

  const handleQuickAdd = (amount) => {
    addContribution(goal.id, amount, 'Daily Streak Contribution 🔥');
    triggerConfetti();
  };

  const handleOpenUpiPay = (amt) => {
    const payAmt = parseFloat(amt) || effectiveDailyRate || 500;
    setUpiPayAmount(payAmt);
    setShowUpiModal(true);
  };

  const handleUpiSuccess = (txData) => {
    const numAmt = parseFloat(txData.amount);
    addContribution(goal.id, numAmt, `${txData.app} UPI Savings Deposit 📲`);
    recordPayment({
      type: 'Goal Deposit',
      description: `${goal.title} Savings Deposit`,
      amount: numAmt,
      utr: txData.utr,
      app: txData.app
    });
    setShowUpiModal(false);
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
    handleOpenUpiPay(effectiveDailyRate || 500);
  };

  const handleOpenEditModal = () => {
    setEditTitle(goal.title);
    setEditCategory(goal.category);
    setEditTargetAmount(goal.targetAmount.toString());
    setEditTargetDate(goal.targetDate);
    setEditDailySavingRate(effectiveDailyRate.toString());
    setEditLockIn(goal.lockIn || false);
    setShowDeleteConfirm(false);
    setShowEditModal(true);
  };

  const handleSaveGoalCustomization = (e) => {
    e.preventDefault();
    if (!editTitle || !editTargetAmount || !editTargetDate) return;

    updateGoal(goal.id, {
      title: editTitle,
      category: editCategory,
      targetAmount: parseFloat(editTargetAmount),
      targetDate: editTargetDate,
      dailySavingRate: parseFloat(editDailySavingRate) || calculateDailySavingRate(editTargetAmount, goal.currentAmount, editTargetDate),
      lockIn: editLockIn
    });

    setShowEditModal(false);
    triggerConfetti();
  };

  const handleDeleteGoal = () => {
    deleteGoal(goal.id);
    navigate('/');
  };

  const autoCalculatedEditRate = (editTargetAmount && editTargetDate)
    ? calculateDailySavingRate(editTargetAmount, goal.currentAmount, editTargetDate)
    : 0;

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
        <button
          onClick={handleOpenEditModal}
          className="btn btn-sm btn-stash-secondary px-3 py-1 text-purple fw-bold rounded-pill d-flex align-items-center gap-1"
        >
          <i className="bi bi-pencil-square"></i> Customize
        </button>
      </div>

      {/* Daily Savings Target Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="stash-card p-3 mb-4 bg-purple-subtle border-purple d-flex flex-wrap align-items-center justify-content-between gap-3"
      >
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle p-2 bg-purple text-white fs-4 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', backgroundColor: '#8B5CF6' }}>
            ⚡
          </div>
          <div>
            <div className="fw-bold text-dark mb-0">Daily Savings Target: ₹{effectiveDailyRate}/day</div>
            <small className="text-secondary">Save ₹{effectiveDailyRate} daily to hit target on {goal.targetDate}</small>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-sm btn-purple text-white fw-bold rounded-pill px-3 py-2 ms-auto"
          style={{ backgroundColor: '#8B5CF6' }}
          onClick={() => handleQuickAdd(effectiveDailyRate)}
        >
          + Save ₹{effectiveDailyRate} Today 🔥
        </motion.button>
      </motion.div>

      {/* Main Goal Card with Circular Progress */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="stash-card p-4 p-md-5 mb-4 text-center position-relative"
      >
        
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
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="circle-meter"
              cx="90"
              cy="90"
              r={radius}
              strokeDasharray={circumference}
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
            Quick Add Daily Savings 🔥
          </label>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="btn btn-purple text-white rounded-pill px-3 py-2 fw-bold shadow-sm"
              style={{ backgroundColor: '#8B5CF6' }}
              onClick={() => handleQuickAdd(effectiveDailyRate)}
            >
              +₹{effectiveDailyRate} (Daily)
            </motion.button>
            {[100, 250, 500].map(amt => (
              <motion.button
                key={amt}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="btn btn-outline-purple rounded-pill px-3 py-2 fw-bold"
                onClick={() => handleQuickAdd(amt)}
              >
                +₹{amt}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="btn btn-stash-secondary rounded-pill px-3 py-2"
              onClick={() => setShowModal(true)}
            >
              Custom +
            </motion.button>
          </div>
        </div>

        {/* Primary Action Buttons: Pay Now & Add to Streak */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="btn btn-stash-primary flex-grow-1 py-3 fs-6 d-flex align-items-center justify-content-center gap-2"
            onClick={() => handleQuickAdd(effectiveDailyRate)}
          >
            <i className="bi bi-fire fs-5"></i> Add Daily Target (+₹{effectiveDailyRate})
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="btn btn-stash-teal flex-grow-1 py-3 fs-6 d-flex align-items-center justify-content-center gap-2"
            onClick={handlePayNow}
          >
            <i className="bi bi-credit-card-fill fs-5"></i> Pay Now (UPI / Card)
          </motion.button>
        </div>

        {/* Pay Now Non-functional Demo Alert */}
        <AnimatePresence>
          {payNotice && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="alert alert-info border-0 rounded-4 mt-3 mb-0 text-start d-flex align-items-center gap-3 overflow-hidden"
            >
              <i className="bi bi-info-circle-fill fs-3 text-purple"></i>
              <div>
                <strong className="d-block">UPI / NetBanking Payment Gateway Coming Soon! 💳</strong>
                <small className="text-secondary">
                  The "Pay Now" feature will seamlessly connect to UPI apps (Google Pay, PhonePe, Paytm) once integrated!
                </small>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Contribution Timeline History Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="stash-card p-4"
      >
        <h4 className="brand-font mb-3 text-dark d-flex align-items-center gap-2">
          <i className="bi bi-clock-history text-purple"></i> Contribution History
        </h4>

        {goal.contributions.length === 0 ? (
          <p className="text-muted text-center py-3">No contributions logged yet. Add your first top-up!</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {goal.contributions.map((c, i) => (
              <motion.div 
                key={c.id || i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-light border-start border-4 border-purple" 
                style={{ borderLeftColor: '#8B5CF6' }}
              >
                <div>
                  <div className="fw-bold text-dark">{c.note || 'Contribution'}</div>
                  <div className="text-muted small">{c.date}</div>
                </div>
                <span className="brand-font fs-5 text-success font-bold">+₹{c.amount.toLocaleString('en-IN')}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Custom Add Contribution Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1085 }}>
            <div className="modal-dialog modal-dialog-centered">
              <motion.div 
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="modal-content rounded-4 border-0 p-3 shadow-lg"
              >
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
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Customize & Edit Goal Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1090 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="modal-content rounded-4 border-0 p-3 shadow-lg"
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title brand-font d-flex align-items-center gap-2 text-dark">
                    <i className="bi bi-pencil-square text-purple"></i> Customize Goal & Daily Plan
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <form onSubmit={handleSaveGoalCustomization}>
                  <div className="modal-body">
                    <div className="row g-3">
                      {/* Goal Title */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold small text-secondary">Goal Title</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          required
                        />
                      </div>

                      {/* Category */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold small text-secondary">Category</label>
                        <select
                          className="form-select rounded-3"
                          value={editCategory}
                          onChange={e => setEditCategory(e.target.value)}
                        >
                          <option value="Product">Gadget / Gaming (Product)</option>
                          <option value="Movie">Movie / Entertainment</option>
                          <option value="Fashion">Fashion & Apparel</option>
                          <option value="Travel">Travel & Outings</option>
                          <option value="Other">Custom Gullak</option>
                        </select>
                      </div>

                      {/* Target Amount */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold small text-secondary">Target Amount (₹)</label>
                        <div className="input-group">
                          <span className="input-group-text border-end-0 fw-bold">₹</span>
                          <input
                            type="number"
                            min="1"
                            className="form-control rounded-end-3 border-start-0"
                            value={editTargetAmount}
                            onChange={e => setEditTargetAmount(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Target Completion Date */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold small text-secondary">Target Completion Date</label>
                        <input
                          type="date"
                          className="form-control rounded-3"
                          value={editTargetDate}
                          onChange={e => setEditTargetDate(e.target.value)}
                          required
                        />
                      </div>

                      {/* Customized Daily Saving Price (₹/day) */}
                      <div className="col-12">
                        <div className="p-3 bg-purple-subtle rounded-4 border">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-1">
                              <i className="bi bi-lightning-fill text-warning"></i> Customize Daily Saving Price (₹/day)
                            </label>
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-purple p-0 text-decoration-none fw-semibold"
                              onClick={() => setEditDailySavingRate(autoCalculatedEditRate.toString())}
                            >
                              Auto-calculate (₹{autoCalculatedEditRate}/d)
                            </button>
                          </div>
                          <div className="input-group mb-2">
                            <span className="input-group-text border-end-0 fw-bold bg-white">₹</span>
                            <input
                              type="number"
                              min="1"
                              className="form-control rounded-end-3 border-start-0"
                              placeholder={`Calculated: ${autoCalculatedEditRate}`}
                              value={editDailySavingRate}
                              onChange={e => setEditDailySavingRate(e.target.value)}
                            />
                          </div>
                          <div className="d-flex gap-2 flex-wrap">
                            {[50, 100, 200, 500].map(preset => (
                              <button
                                key={preset}
                                type="button"
                                className={`btn btn-xs rounded-pill px-3 ${editDailySavingRate == preset ? 'btn-purple text-white' : 'btn-outline-purple'}`}
                                style={{ fontSize: '0.8rem' }}
                                onClick={() => setEditDailySavingRate(preset.toString())}
                              >
                                ₹{preset}/day
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Lock-in Switch */}
                      <div className="col-12">
                        <div className="form-check form-switch bg-light p-3 rounded-3 ms-0 d-flex align-items-center justify-content-between">
                          <label className="form-check-label fw-bold text-dark cursor-pointer m-0" htmlFor="editLockInSwitch">
                            <i className="bi bi-lock-fill text-purple me-1"></i> Enable Savings Lock-in
                          </label>
                          <input
                            className="form-check-input fs-5 m-0"
                            type="checkbox"
                            id="editLockInSwitch"
                            checked={editLockIn}
                            onChange={e => setEditLockIn(e.target.checked)}
                          />
                        </div>
                      </div>

                      {/* Delete Danger Section */}
                      <div className="col-12 pt-2">
                        {showDeleteConfirm ? (
                          <div className="alert alert-danger border-0 rounded-4 d-flex align-items-center justify-content-between p-3 m-0">
                            <span className="small fw-semibold text-danger">Are you sure you want to delete this goal?</span>
                            <div className="d-flex gap-2">
                              <button type="button" className="btn btn-sm btn-light" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                              <button type="button" className="btn btn-sm btn-danger" onClick={handleDeleteGoal}>Yes, Delete</button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-link text-danger p-0 text-decoration-none small fw-semibold"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            <i className="bi bi-trash me-1"></i> Delete this savings goal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0 d-flex justify-content-between">
                    <button type="button" className="btn btn-stash-secondary" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-stash-primary px-4">
                      Save Changes 🚀
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* UPI Payment Gateway Modal */}
      <UPIPaymentModal
        isOpen={showUpiModal}
        onClose={() => setShowUpiModal(false)}
        amount={upiPayAmount}
        title={`Save ₹${upiPayAmount} to ${goal.title}`}
        description="GullakGo UPI Goal Savings Top-Up"
        onSuccess={handleUpiSuccess}
      />
    </div>
  );
}

