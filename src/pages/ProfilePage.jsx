import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { user, goals, toggleParentLink } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentName, setParentName] = useState(user.parentName || '');
  const [parentEmail, setParentEmail] = useState(user.parentEmail || '');

  const filteredGoals = goals.filter(g => {
    if (activeTab === 'active') return g.status === 'active';
    if (activeTab === 'completed') return g.status === 'completed';
    return true;
  });

  const handleSaveParent = (e) => {
    e.preventDefault();
    toggleParentLink(true, { parentName, parentEmail });
    setShowParentModal(false);
  };

  const handleUnlinkParent = () => {
    toggleParentLink(false);
    setShowParentModal(false);
  };

  return (
    <div className="container py-4" style={{ maxWidth: '760px' }}>
      {/* Profile Header Card */}
      <div className="stash-card p-4 p-md-5 mb-4 text-center">
        <div className="position-relative d-inline-block mb-3">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center bg-purple text-white shadow-lg mx-auto"
            style={{
              width: '90px',
              height: '90px',
              fontSize: '2.8rem',
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)'
            }}
          >
            {user.avatar}
          </div>
          <span className="position-absolute bottom-0 end-0 badge rounded-pill bg-warning text-dark border border-white">
            Lvl 3
          </span>
        </div>

        <h3 className="brand-font mb-1 text-dark">{user.name}</h3>
        <p className="text-secondary small mb-2">{user.handle}</p>
        
        <div className="d-flex justify-content-center gap-2 mb-4">
          <span className="badge bg-purple-subtle px-3 py-2 rounded-pill fw-bold">
            🏆 {user.level}
          </span>
          <span className="streak-badge" style={{ padding: '0.35rem 0.85rem' }}>
            🔥 {user.globalStreak} Day Streak
          </span>
        </div>

        {/* User Stats Row in INR (₹) */}
        <div className="row g-2 justify-content-center">
          <div className="col-4 bg-light p-3 rounded-4">
            <div className="text-secondary small fw-semibold">Total Saved</div>
            <div className="brand-font fs-4 text-purple">₹{user.totalSaved.toLocaleString('en-IN')}</div>
          </div>
          <div className="col-4 bg-light p-3 rounded-4">
            <div className="text-secondary small fw-semibold">Total Goals</div>
            <div className="brand-font fs-4 text-dark">{goals.length}</div>
          </div>
          <div className="col-4 bg-light p-3 rounded-4">
            <div className="text-secondary small fw-semibold">Completed</div>
            <div className="brand-font fs-4 text-success">{goals.filter(g => g.status === 'completed').length}</div>
          </div>
        </div>
      </div>

      {/* Linked Parent / Guardian Card */}
      <div className="stash-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock-fill text-purple fs-4"></i>
            <div>
              <h5 className="brand-font mb-0 text-dark">Parent / Guardian Account</h5>
              <small className="text-secondary">Sponsorship, pocket money matching & safety mode</small>
            </div>
          </div>
          <button
            className="btn btn-sm btn-stash-secondary rounded-pill px-3"
            onClick={() => setShowParentModal(true)}
          >
            {user.parentLinked ? 'Manage' : '+ Link Parent'}
          </button>
        </div>

        {user.parentLinked ? (
          <div className="p-3 bg-light rounded-4 border d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle p-2 bg-success-subtle text-success d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-check-circle-fill fs-5"></i>
              </div>
              <div>
                <div className="fw-bold text-dark">{user.parentName}</div>
                <div className="text-muted small">{user.parentEmail}</div>
              </div>
            </div>
            <span className="badge bg-success rounded-pill px-3 py-2">Linked & Verified</span>
          </div>
        ) : (
          <div className="p-3 bg-light rounded-4 text-muted small">
            No parent account linked yet. Link a guardian to receive matching deposit rewards in ₹! 🎁
          </div>
        )}
      </div>

      {/* All Goals List (Active & Completed Filterable) */}
      <div className="stash-card p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h5 className="brand-font mb-0 text-dark">My Savings Goals</h5>

          {/* Filter Pills */}
          <div className="btn-group rounded-pill p-1 bg-light border">
            <button
              className={`btn btn-sm rounded-pill border-0 px-3 fw-semibold ${activeTab === 'all' ? 'bg-purple text-white shadow-sm' : 'text-secondary'}`}
              style={{ backgroundColor: activeTab === 'all' ? '#8B5CF6' : 'transparent' }}
              onClick={() => setActiveTab('all')}
            >
              All ({goals.length})
            </button>
            <button
              className={`btn btn-sm rounded-pill border-0 px-3 fw-semibold ${activeTab === 'active' ? 'bg-purple text-white shadow-sm' : 'text-secondary'}`}
              style={{ backgroundColor: activeTab === 'active' ? '#8B5CF6' : 'transparent' }}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button
              className={`btn btn-sm rounded-pill border-0 px-3 fw-semibold ${activeTab === 'completed' ? 'bg-purple text-white shadow-sm' : 'text-secondary'}`}
              style={{ backgroundColor: activeTab === 'completed' ? '#8B5CF6' : 'transparent' }}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {filteredGoals.length === 0 ? (
          <p className="text-muted text-center py-4">No goals match this filter.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredGoals.map(goal => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const isDone = goal.status === 'completed';

              return (
                <div key={goal.id} className="p-3 rounded-4 bg-light border d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle p-2 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                      style={{ background: isDone ? '#10B981' : 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', width: '46px', height: '46px' }}
                    >
                      <i className={`bi ${goal.icon} fs-5`}></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{goal.title}</div>
                      <div className="text-muted small">
                        ₹{goal.currentAmount.toLocaleString('en-IN')} of ₹{goal.targetAmount.toLocaleString('en-IN')} • ({pct}%)
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {isDone ? (
                      <span className="badge bg-success rounded-pill px-3 py-2">
                        Completed 🎉
                      </span>
                    ) : (
                      <Link to={`/goals/${goal.id}`} className="btn btn-sm btn-stash-primary px-3">
                        View
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Link Parent Modal */}
      {showParentModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title brand-font">Manage Parent / Guardian 🛡️</h5>
                <button type="button" className="btn-close" onClick={() => setShowParentModal(false)}></button>
              </div>
              <form onSubmit={handleSaveParent}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-semibold">Guardian Full Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Rajesh Sharma (Dad)"
                      value={parentName}
                      onChange={e => setParentName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-semibold">Guardian Email</label>
                    <input
                      type="email"
                      className="form-control rounded-3"
                      placeholder="parent@example.com"
                      value={parentEmail}
                      onChange={e => setParentEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0 d-flex justify-content-between">
                  {user.parentLinked ? (
                    <button type="button" className="btn btn-outline-danger rounded-pill" onClick={handleUnlinkParent}>
                      Unlink Parent
                    </button>
                  ) : <div></div>}
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-stash-secondary" onClick={() => setShowParentModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-stash-primary">Save Changes</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
