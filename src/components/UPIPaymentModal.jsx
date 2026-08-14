import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function UPIPaymentModal({
  isOpen,
  onClose,
  amount,
  title = 'Payment',
  description = 'GullakGo Deposit',
  onSuccess
}) {
  const [activeTab, setActiveTab] = useState('apps'); // 'apps' | 'vpa' | 'qr'
  const [selectedApp, setSelectedApp] = useState(null);
  const [vpaId, setVpaId] = useState('');
  const [step, setStep] = useState('select'); // 'select' | 'pin' | 'processing' | 'success'
  const [pin, setPin] = useState(['', '', '', '']);
  const [utrNumber, setUtrNumber] = useState('');
  const [processingText, setProcessingText] = useState('Securing UPI Channel...');

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedApp(null);
      setVpaId('');
      setPin(['', '', '', '']);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: 'bi-google', color: '#4285F4', bg: '#E8F0FE', handle: 'gpay' },
    { id: 'phonepe', name: 'PhonePe', icon: 'bi-phone', color: '#5F259F', bg: '#F3E8FF', handle: 'ybl' },
    { id: 'paytm', name: 'Paytm UPI', icon: 'bi-wallet2', color: '#00BAF2', bg: '#E0F7FA', handle: 'paytm' },
    { id: 'bhim', name: 'BHIM UPI', icon: 'bi-qr-code-scan', color: '#00529C', bg: '#E3F2FD', handle: 'upi' },
    { id: 'cred', name: 'CRED Pay', icon: 'bi-credit-card-2-front', color: '#111111', bg: '#F1F5F9', handle: 'cred' }
  ];

  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setStep('pin');
  };

  const handleVpaSubmit = (e) => {
    e.preventDefault();
    if (!vpaId || !vpaId.includes('@')) return;
    setSelectedApp({ id: 'vpa', name: `UPI ID (${vpaId})`, color: '#7C3AED' });
    setStep('pin');
  };

  const handleQrPay = () => {
    setSelectedApp({ id: 'qr', name: 'UPI QR Scan', color: '#10B981' });
    setStep('pin');
  };

  const handlePinChange = (index, val) => {
    if (val.length > 1) val = val[val.length - 1];
    const newPin = [...pin];
    newPin[index] = val;
    setPin(newPin);

    // Auto move to next field
    if (val && index < 3) {
      const nextInput = document.getElementById(`upi-pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleAuthorize = () => {
    setStep('processing');
    setProcessingText('Contacting Bank Server...');
    
    setTimeout(() => {
      setProcessingText('Verifying UPI PIN...');
    }, 1000);

    setTimeout(() => {
      const generatedUtr = 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000);
      setUtrNumber(generatedUtr);
      setStep('success');

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (err) {
        console.log(err);
      }

      if (onSuccess) {
        onSuccess({
          amount: parseFloat(amount),
          utr: generatedUtr,
          app: selectedApp ? selectedApp.name : 'UPI Payment',
          title,
          description
        });
      }
    }, 2200);
  };

  // Generate Google Chart API QR Code image URL for standard UPI link format
  const upiLink = `upi://pay?pa=gullakgo@bank&pn=GullakGo&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}&color=4F46E5`;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1095 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="modal-content rounded-4 border-0 shadow-lg overflow-hidden"
        >
          {/* Header Banner */}
          <div
            className="p-4 text-white position-relative"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)' }}
          >
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              onClick={onClose}
              disabled={step === 'processing'}
            ></button>
            <div className="badge bg-white text-purple rounded-pill px-3 py-1 fw-bold mb-2 shadow-sm" style={{ color: '#7C3AED' }}>
              🔒 100% SECURE UPI GATEWAY
            </div>
            <h4 className="brand-font mb-1">{title}</h4>
            <p className="small opacity-90 mb-0">{description}</p>

            <div className="mt-3 p-3 rounded-4 bg-white text-dark d-flex align-items-center justify-content-between shadow-sm">
              <span className="small text-secondary fw-semibold">Total Payable Amount</span>
              <span className="brand-font fs-3 text-purple fw-bold" style={{ color: '#7C3AED' }}>
                ₹{parseFloat(amount || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="modal-body p-4">
            <AnimatePresence mode="wait">
              {/* STEP 1: Select Payment Method */}
              {step === 'select' && (
                <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Method Navigation Tabs */}
                  <ul className="nav nav-pills nav-justified mb-3 p-1 bg-light rounded-pill border">
                    <li className="nav-item">
                      <button
                        className={`nav-link rounded-pill py-2 small fw-bold ${activeTab === 'apps' ? 'active bg-purple text-white shadow-sm' : 'text-secondary'}`}
                        style={{ backgroundColor: activeTab === 'apps' ? '#8B5CF6' : 'transparent' }}
                        onClick={() => setActiveTab('apps')}
                      >
                        <i className="bi bi-phone me-1"></i> UPI Apps
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link rounded-pill py-2 small fw-bold ${activeTab === 'vpa' ? 'active bg-purple text-white shadow-sm' : 'text-secondary'}`}
                        style={{ backgroundColor: activeTab === 'vpa' ? '#8B5CF6' : 'transparent' }}
                        onClick={() => setActiveTab('vpa')}
                      >
                        <i className="bi bi-at me-1"></i> UPI ID
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link rounded-pill py-2 small fw-bold ${activeTab === 'qr' ? 'active bg-purple text-white shadow-sm' : 'text-secondary'}`}
                        style={{ backgroundColor: activeTab === 'qr' ? '#8B5CF6' : 'transparent' }}
                        onClick={() => setActiveTab('qr')}
                      >
                        <i className="bi bi-qr-code-scan me-1"></i> QR Code
                      </button>
                    </li>
                  </ul>

                  {/* TAB 1: UPI APPS */}
                  {activeTab === 'apps' && (
                    <div className="d-flex flex-column gap-2">
                      {upiApps.map(app => (
                        <motion.div
                          key={app.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAppSelect(app)}
                          className="p-3 rounded-4 border cursor-pointer d-flex align-items-center justify-content-between transition-all"
                          style={{ backgroundColor: 'var(--card-bg)', cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle p-2 d-flex align-items-center justify-content-center fw-bold"
                              style={{ width: '44px', height: '44px', backgroundColor: app.bg, color: app.color }}
                            >
                              <i className={`bi ${app.icon} fs-5`}></i>
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{app.name}</div>
                              <small className="text-secondary">Instant Auto-App Launch</small>
                            </div>
                          </div>
                          <i className="bi bi-chevron-right text-muted"></i>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: UPI VPA ENTRY */}
                  {activeTab === 'vpa' && (
                    <form onSubmit={handleVpaSubmit} className="py-2">
                      <label className="form-label text-secondary small fw-semibold">Enter your VPA / UPI ID</label>
                      <div className="input-group mb-3">
                        <span className="input-group-text border-end-0 bg-light"><i className="bi bi-person-badge"></i></span>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-end-3 fs-6"
                          placeholder="e.g. mobile@paytm or name@okicici"
                          value={vpaId}
                          onChange={e => setVpaId(e.target.value)}
                          required
                        />
                      </div>

                      <div className="d-flex gap-1 flex-wrap mb-4">
                        {['@okicici', '@ybl', '@paytm', '@upi', '@axisbank'].map(suffix => (
                          <button
                            key={suffix}
                            type="button"
                            className="btn btn-xs btn-outline-secondary rounded-pill"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => {
                              const base = vpaId.split('@')[0] || 'aarav';
                              setVpaId(base + suffix);
                            }}
                          >
                            {suffix}
                          </button>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={!vpaId || !vpaId.includes('@')}
                        className="btn btn-stash-primary w-100 py-3 fs-6"
                      >
                        Verify & Pay ₹{parseFloat(amount || 0).toLocaleString('en-IN')} <i className="bi bi-arrow-right"></i>
                      </button>
                    </form>
                  )}

                  {/* TAB 3: SCAN QR CODE */}
                  {activeTab === 'qr' && (
                    <div className="text-center py-2">
                      <p className="small text-secondary mb-3">Scan this QR Code using any UPI App (GPay, PhonePe, Paytm, BHIM) on your mobile camera</p>
                      <div className="p-3 bg-white border rounded-4 d-inline-block shadow-sm mb-3 position-relative">
                        <img
                          src={qrCodeUrl}
                          alt="UPI Payment QR Code"
                          width="180"
                          height="180"
                          className="rounded-3"
                          onError={(e) => {
                            // Fallback rendering if offline
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="fw-bold small text-purple mt-2" style={{ color: '#7C3AED' }}>BHIM UPI Instant QR</div>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn btn-stash-teal w-100 py-3"
                          onClick={handleQrPay}
                        >
                          <i className="bi bi-check-circle-fill me-1"></i> I Have Scanned & Paid
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: UPI PIN Verification Simulation */}
              {step === 'pin' && (
                <motion.div key="pin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-2">
                  <div className="badge bg-purple-subtle text-purple px-3 py-1 rounded-pill fw-bold mb-3" style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}>
                    Authorizing with {selectedApp?.name}
                  </div>
                  <h5 className="brand-font text-dark mb-1">Enter 4-Digit UPI PIN 🔐</h5>
                  <p className="small text-secondary mb-4">Secured by NPCI Unified Payments Interface</p>

                  <div className="d-flex justify-content-center gap-2 mb-4">
                    {[0, 1, 2, 3].map(i => (
                      <input
                        key={i}
                        id={`upi-pin-${i}`}
                        type="password"
                        maxLength="1"
                        className="form-control text-center fs-3 fw-bold rounded-3 shadow-sm"
                        style={{ width: '56px', height: '56px', border: '2px solid #8B5CF6' }}
                        value={pin[i]}
                        onChange={e => handlePinChange(i, e.target.value)}
                      />
                    ))}
                  </div>

                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-stash-secondary" onClick={() => setStep('select')}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-stash-primary flex-grow-1 py-3"
                      onClick={handleAuthorize}
                    >
                      Authorize Payment <i className="bi bi-check2-circle ms-1"></i>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Processing Loader */}
              {step === 'processing' && (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5">
                  <div className="spinner-border text-purple mb-4" style={{ width: '3.5rem', height: '3.5rem', color: '#8B5CF6' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h5 className="brand-font text-dark mb-2">{processingText}</h5>
                  <p className="small text-muted">Please do not press back or refresh the page.</p>
                </motion.div>
              )}

              {/* STEP 4: Success & Digital Receipt */}
              {step === 'success' && (
                <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-2">
                  <div
                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <i className="bi bi-check-lg fs-1"></i>
                  </div>
                  <h4 className="brand-font text-dark mb-1">UPI Payment Successful! 🎉</h4>
                  <p className="small text-secondary mb-4">Your transaction has been processed and verified.</p>

                  {/* Digital Receipt Box */}
                  <div className="p-3 bg-light rounded-4 border text-start mb-4">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="small text-muted">Status</span>
                      <span className="badge bg-success text-white">SUCCESS</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="small text-muted">Ref UTR</span>
                      <span className="fw-mono small font-monospace text-dark">{utrNumber}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="small text-muted">Payment Mode</span>
                      <span className="fw-semibold small text-dark">{selectedApp?.name}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small text-muted">Amount Paid</span>
                      <span className="brand-font fs-5 text-purple fw-bold" style={{ color: '#7C3AED' }}>
                        ₹{parseFloat(amount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button type="button" className="btn btn-stash-primary w-100 py-3 fs-6" onClick={onClose}>
                    Done & View Gullak <i className="bi bi-arrow-right"></i>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
