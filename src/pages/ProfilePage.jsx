import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { user, goals, toggleParentLink, bankAccount, updateBankAccountDetails, paymentHistory } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentName, setParentName] = useState(user.parentName || '');
  const [parentEmail, setParentEmail] = useState(user.parentEmail || '');

  // Bank Account Modal State
  const [showBankModal, setShowBankModal] = useState(false);
  const [editUpiId, setEditUpiId] = useState(bankAccount.upiId || '');
  const [editBankName, setEditBankName] = useState(bankAccount.bankName || '');
  const [editAccountNumber, setEditAccountNumber] = useState(bankAccount.accountNumber || '');
  const [editIfscCode, setEditIfscCode] = useState(bankAccount.ifscCode || '');
  const [editAccountHolder, setEditAccountHolder] = useState(bankAccount.accountHolder || '');

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

  const handleSaveBankDetails = (e) => {
    e.preventDefault();
    updateBankAccountDetails({
      upiId: editUpiId,
      bankName: editBankName,
      accountNumber: editAccountNumber,
      ifscCode: editIfscCode,
      accountHolder: editAccountHolder
    });
    setShowBankModal(false);
  };

  return (
    <div className="container py-4" style={{ maxWidth: '760px' }}>
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="stash-card p-4 p-md-5 mb-4 text-center"
      >
        <div className="position-relative d-inline-block mb-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="rounded-circle d-flex align-items-center justify-content-center bg-purple text-white shadow-lg mx-auto"
            style={{
              width: '90px',
              height: '90px',
              fontSize: '2.8rem',
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)'
            }}
          >
            {user.avatar}
          </motion.div>
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
      </motion.div>

      {/* Linked Bank Account & UPI Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="stash-card p-4 mb-4"
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-bank2 text-purple fs-4"></i>
            <div>
              <h5 className="brand-font mb-0 text-dark">Linked Bank Account & UPI ID</h5>
              <small className="text-secondary">Withdrawal payouts, interest distribution & UPI deposits</small>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-sm btn-stash-secondary rounded-pill px-3"
            onClick={() => {
              setEditUpiId(bankAccount.upiId || '');
              setEditBankName(bankAccount.bankName || '');
              setEditAccountNumber(bankAccount.accountNumber || '');
              setEditIfscCode(bankAccount.ifscCode || '');
              setEditAccountHolder(bankAccount.accountHolder || '');
              setShowBankModal(true);
            }}
          >
            Manage Bank / UPI ✏️
          </motion.button>
        </div>

        <div className="p-3 bg-purple-subtle rounded-4 border border-purple-subtle">
          <div className="row g-2">
            <div className="col-12 col-sm-6">
              <span className="text-secondary small fw-semibold d-block">Primary UPI VPA ID</span>
              <span className="fw-bold text-purple fs-6">{bankAccount.upiId || 'aarav@okaxis'}</span>
            </div>
            <div className="col-12 col-sm-6">
              <span className="text-secondary small fw-semibold d-block">Bank Name</span>
              <span className="fw-bold text-dark fs-6">{bankAccount.bankName || 'HDFC Bank'}</span>
            </div>
            <div className="col-12 col-sm-6">
              <span className="text-secondary small fw-semibold d-block">Account Number</span>
              <span className="fw-mono text-dark font-monospace">{bankAccount.accountNumber || '••••••••4892'}</span>
            </div>
            <div className="col-12 col-sm-6">
              <span className="text-secondary small fw-semibold d-block">IFSC Code</span>
              <span className="fw-mono text-dark font-monospace">{bankAccount.ifscCode || 'HDFC0001234'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Linked Parent / Guardian Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="stash-card p-4 mb-4"
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock-fill text-purple fs-4"></i>
            <div>
              <h5 className="brand-font mb-0 text-dark">Parent / Guardian Account</h5>
              <small className="text-secondary">Sponsorship, pocket money matching & safety mode</small>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-sm btn-stash-secondary rounded-pill px-3"
            onClick={() => setShowParentModal(true)}
          >
            {user.parentLinked ? 'Manage' : '+ Link Parent'}
          </motion.button>
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
      </motion.div>

      {/* All Goals List (Active & Completed Filterable) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="stash-card p-4"
      >
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
            <AnimatePresence mode="popLayout">
              {filteredGoals.map((goal, idx) => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                const isDone = goal.status === 'completed';

                return (
                  <motion.div 
                    key={goal.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="p-3 rounded-4 bg-light border d-flex align-items-center justify-content-between gap-3"
                  >
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
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* UPI Payment & Transaction Receipts History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="stash-card p-4 mb-4"
      >
        <h5 className="brand-font mb-3 text-dark d-flex align-items-center gap-2">
          <i className="bi bi-receipt text-purple"></i> UPI Payment History & Receipts
        </h5>

        {paymentHistory.length === 0 ? (
          <p className="text-muted small mb-0">No UPI payments logged yet.</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {paymentHistory.map((tx) => (
              <div key={tx.id} className="p-3 bg-light rounded-4 border d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div>
                  <div className="fw-bold text-dark">{tx.description || tx.type}</div>
                  <div className="text-muted small d-flex align-items-center gap-2">
                    <span className="fw-mono font-monospace">{tx.utr}</span>
                    <span>•</span>
                    <span>{tx.date}</span>
                    {tx.app && <span className="badge bg-white text-dark border">{tx.app}</span>}
                  </div>
                </div>
                <div className="text-end">
                  <div className="brand-font fs-5 text-success font-bold">₹{parseFloat(tx.amount).toLocaleString('en-IN')}</div>
                  <span className="badge bg-success-subtle text-success small fw-bold">VERIFIED UPI</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Link Parent Modal */}
      <AnimatePresence>
        {showParentModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1085 }}>
            <div className="modal-dialog modal-dialog-centered">
              <motion.div 
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="modal-content rounded-4 border-0 p-3 shadow-lg"
              >
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
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Bank & UPI Modal */}
      <AnimatePresence>
        {showBankModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1085 }}>
            <div className="modal-dialog modal-dialog-centered">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="modal-content rounded-4 border-0 p-3 shadow-lg"
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title brand-font">Manage Bank & UPI Details 🏦</h5>
                  <button type="button" className="btn-close" onClick={() => setShowBankModal(false)}></button>
                </div>
                <form onSubmit={handleSaveBankDetails}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label text-secondary small fw-semibold">Primary UPI ID (VPA)</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="aarav@okaxis"
                        value={editUpiId}
                        onChange={e => setEditUpiId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary small fw-semibold">Bank Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="HDFC Bank"
                        value={editBankName}
                        onChange={e => setEditBankName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary small fw-semibold">Account Holder Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="Aarav Sharma"
                        value={editAccountHolder}
                        onChange={e => setEditAccountHolder(e.target.value)}
                        required
                      />
                    </div>
                    <div className="row g-2">
                      <div className="col-7 mb-3">
                        <label className="form-label text-secondary small fw-semibold">Account Number</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          placeholder="••••••••4892"
                          value={editAccountNumber}
                          onChange={e => setEditAccountNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-5 mb-3">
                        <label className="form-label text-secondary small fw-semibold">IFSC Code</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          placeholder="HDFC0001234"
                          value={editIfscCode}
                          onChange={e => setEditIfscCode(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-stash-secondary" onClick={() => setShowBankModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-stash-primary">Save Details 🏦</button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

