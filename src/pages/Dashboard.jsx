import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SubscriptionModal from '../components/SubscriptionModal';

export default function Dashboard() {
  const { user, goals, expenses, subscription, themeMode, toggleTheme } = useApp();
  const [showSubModal, setShowSubModal] = useState(false);

  const activeGoals = goals.filter(g => g.status === 'active');

  const getDaysRemaining = (targetDateStr) => {
    const today = new Date();
    const target = new Date(targetDateStr);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat.toLowerCase()) {
      case 'product': return 'badge-product';
      case 'movie': return 'badge-movie';
      case 'fashion': return 'badge-fashion';
      case 'travel': return 'badge-travel';
      default: return 'badge-other';
    }
  };

  return (
    <div className="pb-4">
      {/* Playful Hero Header */}
      <div className="hero-banner mb-4">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fs-3">{user.avatar}</span>
                <span className="badge bg-white text-dark rounded-pill fw-bold px-3 py-1 shadow-sm">
                  {user.level}
                </span>
              </div>
              <h1 className="brand-font display-6 mb-1 text-white">
                Hey, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="opacity-90 mb-0">
                You've saved <strong className="text-warning fs-5">₹{user.totalSaved.toLocaleString('en-IN')}</strong> across your goals! Keep it up! 🚀
              </p>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* Day / Night Mode Toggle on Mobile Viewport */}
              <button 
                className="theme-toggle-btn d-md-none bg-white text-dark" 
                onClick={toggleTheme}
              >
                <i className={`bi ${themeMode === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-purple'}`}></i>
                <span>{themeMode === 'dark' ? 'Day' : 'Night'}</span>
              </button>

              {/* Global Streak Card Widget */}
              <div className="glass-panel p-3 text-white text-center d-flex align-items-center gap-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center bg-warning text-dark fw-bold shadow"
                  style={{ width: '52px', height: '52px', fontSize: '1.6rem' }}
                >
                  🔥
                </div>
                <div className="text-start">
                  <div className="text-uppercase small fw-bold opacity-75">Current Streak</div>
                  <div className="brand-font fs-3 fw-bold mb-0 text-white line-height-1">
                    {user.globalStreak} Days!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Quick Actions Bar */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <Link to="/goals/new" className="btn btn-stash-primary d-inline-flex align-items-center gap-2">
            <i className="bi bi-plus-circle-fill"></i>
            New Goal
          </Link>
          <Link to="/expenses" className="btn btn-stash-secondary d-inline-flex align-items-center gap-2">
            <i className="bi bi-receipt"></i>
            Log Expense
          </Link>
          {user.parentLinked && (
            <div className="ms-auto d-none d-sm-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill border shadow-sm">
              <i className="bi bi-shield-check text-success fs-5"></i>
              <span className="small text-secondary fw-semibold">Parent Linked: <strong className="text-dark">{user.parentName.split(' ')[0]}</strong></span>
            </div>
          )}
        </div>

        {/* Gamification & Badges Showcase Banner */}
        <div className="stash-card p-3 p-md-4 mb-4 text-dark position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="display-6">🏆</div>
              <div>
                <h5 className="brand-font mb-1 text-dark">Savings Achievements & Badges</h5>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-warning text-dark px-2 py-1 rounded-pill small"><i className="bi bi-fire me-1"></i> {user.globalStreak}-Day Streak</span>
                  <span className="badge bg-purple text-white px-2 py-1 rounded-pill small" style={{ backgroundColor: '#8B5CF6' }}>🎯 Halfway Hero</span>
                  <span className="badge bg-success text-white px-2 py-1 rounded-pill small">💰 ₹40k+ Saved</span>
                </div>
              </div>
            </div>
            <button 
              className="btn btn-sm text-white fw-bold rounded-pill px-4 py-2 shadow-sm ms-auto"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}
              onClick={() => setShowSubModal(true)}
            >
              👑 {subscription?.planId === 'monthly' ? 'Pro Member' : 'Upgrade Plan'}
            </button>
          </div>
        </div>

        {/* Section Header: Active Goals */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="brand-font mb-0 text-dark">Active Goals 🎯</h3>
            <p className="text-secondary small mb-0">Swipe or scroll horizontally to explore</p>
          </div>
          <Link to="/goals" className="text-purple text-decoration-none fw-bold small me-1">
            View All ({goals.length}) <i className="bi bi-chevron-right"></i>
          </Link>
        </div>

        {/* Horizontally Scrollable Active Goals Cards */}
        {activeGoals.length === 0 ? (
          <div className="stash-card p-5 text-center mb-4">
            <div className="display-4 text-muted mb-2">🎯</div>
            <h5 className="brand-font">No active goals yet!</h5>
            <p className="text-secondary small">Start saving for your favorite stuff in ₹ Rupees!</p>
            <Link to="/goals/new" className="btn btn-stash-primary mt-2">
              Create Your First Goal
            </Link>
          </div>
        ) : (
          <div className="horizontal-scroll-snap mb-4 pe-2">
            {activeGoals.map(goal => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const daysLeft = getDaysRemaining(goal.targetDate);

              return (
                <div key={goal.id} className="stash-card p-4 d-flex flex-column justify-content-between">
                  <div>
                    {/* Top Row: Category + Streak */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className={`category-badge ${getCategoryBadgeClass(goal.category)}`}>
                        <i className={`bi ${goal.icon}`}></i> {goal.category}
                      </span>
                      <div className="streak-badge" style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>
                        <i className="bi bi-fire text-warning"></i> {goal.streak}d
                      </div>
                    </div>

                    {/* Goal Title */}
                    <h4 className="brand-font mb-3 text-dark text-truncate" title={goal.title}>
                      {goal.title}
                    </h4>

                    {/* Money Figures in INR (₹) */}
                    <div className="d-flex justify-content-between align-items-baseline mb-2">
                      <span className="brand-font fs-4 text-purple fw-bold" style={{ color: '#7C3AED' }}>
                        ₹{goal.currentAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-secondary small fw-semibold">
                        of ₹{goal.targetAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="stash-progress-container mb-3">
                      <div 
                        className="stash-progress-bar" 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    {/* Footer Info & Details Button */}
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="text-muted small d-flex align-items-center gap-1">
                        <i className="bi bi-clock-history"></i> {daysLeft} days left
                      </span>
                      <Link 
                        to={`/goals/${goal.id}`} 
                        className="btn btn-sm btn-stash-primary px-3 py-1 text-decoration-none"
                        style={{ fontSize: '0.85rem' }}
                      >
                        View & Save <i className="bi bi-arrow-right-short"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Two Column Grid for Bottom Dashboard Widgets */}
        <div className="row g-4">
          {/* Daily Motivation / Tips Widget */}
          <div className="col-12 col-md-6">
            <div className="stash-card p-4 h-100 bg-white d-flex align-items-center gap-3">
              <div 
                className="rounded-circle p-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #84CC16 100%)', width: '60px', height: '60px' }}
              >
                <i className="bi bi-lightbulb-fill fs-2"></i>
              </div>
              <div>
                <span className="badge bg-success-subtle text-success px-2 py-1 rounded-pill small fw-bold mb-1">
                  Pro Savings Tip 💡
                </span>
                <h6 className="brand-font mb-1 text-dark">The 24-Hour Cooling Rule</h6>
                <p className="text-secondary small mb-0">
                  Before buying non-essential items, wait 24 hours. You'll often find you didn't really need it!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Expense Snapshot Widget */}
          <div className="col-12 col-md-6">
            <div className="stash-card p-4 h-100 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="brand-font mb-0 text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-wallet2 text-purple"></i> Recent Expenses
                </h5>
                <Link to="/expenses" className="small text-purple fw-bold text-decoration-none">
                  All Expenses <i className="bi bi-chevron-right"></i>
                </Link>
              </div>

              {expenses.length === 0 ? (
                <p className="text-muted small">No expenses logged yet.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {expenses.slice(0, 2).map(exp => (
                    <div key={exp.id} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
                      <div className="d-flex align-items-center gap-2">
                        <i className={`bi ${exp.icon} text-purple fs-5`}></i>
                        <div>
                          <div className="fw-semibold small text-dark">{exp.title}</div>
                          <div className="text-muted text-xs" style={{ fontSize: '0.75rem' }}>{exp.category}</div>
                        </div>
                      </div>
                      <span className="fw-bold text-danger small">-₹{exp.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>

      </div>

      {/* Subscription Upgrade Modal */}
      <SubscriptionModal 
        isOpen={showSubModal} 
        onClose={() => setShowSubModal(false)} 
      />
    </div>
    </div>
  );
}
