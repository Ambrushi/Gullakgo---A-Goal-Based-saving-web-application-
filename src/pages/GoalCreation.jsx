import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function GoalCreation() {
  const navigate = useNavigate();
  const { addGoal } = useApp();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('Product');
  const [icon, setIcon] = useState('bi-controller');
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [lockIn, setLockIn] = useState(false);

  const categories = [
    { name: 'Product', icon: 'bi-controller', label: 'Gadget / Gaming', desc: 'Console, phone, PC, headphones' },
    { name: 'Movie', icon: 'bi-film', label: 'Movie / Entertainment', desc: 'Tickets, concert, festival pass' },
    { name: 'Fashion', icon: 'bi-box-seam', label: 'Apparel & Sneakers', desc: 'Kicks, hoodie, watch, accessories' },
    { name: 'Travel', icon: 'bi-airplane', label: 'Trip & Outings', desc: 'Camp trip, amusement park, vacation' },
    { name: 'Other', icon: 'bi-star-fill', label: 'Custom Gullak', desc: 'Anything else you are dreaming of!' }
  ];

  const handleCategorySelect = (cat) => {
    setCategory(cat.name);
    setIcon(cat.icon);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !targetAmount || !targetDate) return;

    addGoal({
      title,
      category,
      icon,
      targetAmount: parseFloat(targetAmount),
      targetDate,
      lockIn
    });

    navigate('/');
  };

  return (
    <div className="container py-4" style={{ maxWidth: '640px' }}>
      {/* Header with back button */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <Link to="/" className="btn btn-sm btn-stash-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
          <i className="bi bi-arrow-left fs-5"></i>
        </Link>
        <h3 className="brand-font mb-0 text-center flex-grow-1">Create Savings Goal 🎯</h3>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Step Indicator */}
      <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="d-flex align-items-center gap-2">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${
                step >= i ? 'bg-purple text-white shadow-sm' : 'bg-light text-secondary border'
              }`}
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: step >= i ? '#8B5CF6' : 'var(--card-bg)',
                color: step >= i ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              {i}
            </div>
            {i < 3 && <div className="bg-secondary opacity-25" style={{ width: '30px', height: '3px' }}></div>}
          </div>
        ))}
      </div>

      <div className="stash-card p-4 p-md-5">
        {step === 1 && (
          <div>
            <span className="badge bg-purple-subtle px-3 py-1 rounded-pill fw-bold mb-2">
              Step 1: Goal Category
            </span>
            <h4 className="brand-font mb-3 text-dark">What are you saving for? 🛍️</h4>

            <div className="d-flex flex-column gap-3 mb-4">
              {categories.map(cat => {
                const isSelected = category === cat.name;
                return (
                  <div
                    key={cat.name}
                    className={`p-3 rounded-4 border cursor-pointer transition-all d-flex align-items-center gap-3 ${
                      isSelected ? 'border-purple shadow-sm' : 'stash-card'
                    }`}
                    style={{
                      borderColor: isSelected ? '#8B5CF6' : 'var(--border-color)',
                      borderWidth: isSelected ? '2px' : '1px',
                      backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.12)' : 'var(--card-bg)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    <div
                      className="rounded-circle p-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                      style={{ background: isSelected ? 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' : '#94A3B8', width: '48px', height: '48px' }}
                    >
                      <i className={`bi ${cat.icon} fs-4`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="brand-font mb-0 text-dark">{cat.label}</h6>
                      <small className="text-secondary">{cat.desc}</small>
                    </div>
                    {isSelected && <i className="bi bi-check-circle-fill text-purple fs-4"></i>}
                  </div>
                );
              })}
            </div>

            <button className="btn btn-stash-primary w-100 py-3 fs-6" onClick={() => setStep(2)}>
              Next: Goal Details <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <span className="badge bg-purple-subtle px-3 py-1 rounded-pill fw-bold mb-2">
              Step 2: Amount & Timeline
            </span>
            <h4 className="brand-font mb-3 text-dark">Set Target Details 💰</h4>

            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Goal Title</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3 fs-6"
                placeholder="e.g. PlayStation 5 or Air Jordans"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Target Amount (₹)</label>
              <div className="input-group">
                <span className="input-group-text border-end-0 fw-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  className="form-control form-control-lg rounded-end-3 fs-6 border-start-0"
                  placeholder="5000"
                  value={targetAmount}
                  onChange={e => setTargetAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small text-secondary">Target Completion Date</label>
              <input
                type="date"
                className="form-control form-control-lg rounded-3 fs-6"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-stash-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className="btn btn-stash-primary flex-grow-1"
                onClick={() => {
                  if (title && targetAmount && targetDate) setStep(3);
                }}
                disabled={!title || !targetAmount || !targetDate}
              >
                Next: Lock-in Options <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <span className="badge bg-purple-subtle px-3 py-1 rounded-pill fw-bold mb-2">
              Step 3: Final Touches & Discipline
            </span>
            <h4 className="brand-font mb-3 text-dark">Lock-in Period & Review 🔒</h4>

            {/* Lock-in Toggle Box */}
            <div className="p-3 bg-light rounded-4 border mb-4">
              <div className="form-check form-switch d-flex align-items-center justify-content-between p-0 m-0">
                <div>
                  <label className="form-check-label fw-bold text-dark cursor-pointer m-0 d-flex align-items-center gap-2" htmlFor="lockInSwitch">
                    <i className="bi bi-lock-fill text-purple fs-5"></i>
                    Enable Savings Lock-in Period?
                  </label>
                  <p className="small text-muted mb-0 mt-1">
                    Prevents early payout withdrawals until target date is reached. Helps build true discipline! 💪
                  </p>
                </div>
                <input
                  className="form-check-input ms-2 fs-4"
                  type="checkbox"
                  id="lockInSwitch"
                  checked={lockIn}
                  onChange={e => setLockIn(e.target.checked)}
                />
              </div>
            </div>

            {/* Goal Preview Card */}
            <div className="p-3 rounded-4 border bg-purple-subtle mb-4">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle p-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', width: '52px', height: '52px' }}
                >
                  <i className={`bi ${icon} fs-3`}></i>
                </div>
                <div>
                  <div className="badge bg-purple text-white mb-1" style={{ backgroundColor: '#8B5CF6' }}>{category}</div>
                  <h5 className="brand-font mb-0 text-dark">{title}</h5>
                  <div className="fw-bold text-purple">Target: ₹{parseFloat(targetAmount).toLocaleString('en-IN')} by {targetDate}</div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-stash-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn btn-stash-primary flex-grow-1 py-3" onClick={handleSubmit}>
                Launch Goal Now 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
