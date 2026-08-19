import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp, SUBSCRIPTION_PLANS } from '../context/AppContext';
import UPIPaymentModal from './UPIPaymentModal';

export default function SubscriptionModal({ isOpen, onClose, isLimitReached = false }) {
  const { subscription, subscribeToPlan, recordPayment, user, getRemainingPrompts, getSubscriptionExpiryStatus } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState('monthly');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // 'all' | 'daily' | 'monthly'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'wallet' | 'upi' | 'parent'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);

  const currentPlanId = subscription?.planId || 'free';
  const currentPlan = SUBSCRIPTION_PLANS[currentPlanId] || SUBSCRIPTION_PLANS.free;
  const usageInfo = getRemainingPrompts();
  const expiryStatus = getSubscriptionExpiryStatus();
  const allPlans = Object.values(SUBSCRIPTION_PLANS);

  const displayedPlans = allPlans.filter(p => {
    if (activeCategoryFilter === 'monthly') return p.period === 'month';
    if (activeCategoryFilter === 'daily_weekly') return p.period === 'day' || p.period === 'week';
    return true;
  });

  const targetPlan = SUBSCRIPTION_PLANS[selectedPlanId] || SUBSCRIPTION_PLANS.monthly;

  const handleSubscribe = () => {
    if (selectedPlanId === currentPlanId) return;

    if (paymentMethod === 'upi') {
      setShowUpiModal(true);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      subscribeToPlan(selectedPlanId);
      recordPayment({
        type: 'Subscription',
        description: `${targetPlan.name} Upgrade`,
        amount: targetPlan.price,
        app: paymentMethod === 'wallet' ? 'Gullak Wallet' : 'Parent Link'
      });
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (err) {
        console.log('Confetti error', err);
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  const handleUpiSuccess = (txData) => {
    subscribeToPlan(selectedPlanId);
    recordPayment({
      type: 'Subscription',
      description: `${targetPlan.name} Upgrade`,
      amount: targetPlan.price,
      utr: txData.utr,
      app: txData.app
    });
    setShowUpiModal(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1085 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="modal-content border-0 rounded-4 shadow-lg overflow-hidden style-modal bg-white text-dark"
            >
              
              {/* Top Banner Header */}
              <div 
                className="p-4 text-white text-center position-relative" 
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}
              >
                <button 
                  type="button" 
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                  onClick={onClose}
                ></button>

                <span className="badge bg-white text-purple mb-2 fw-bold px-3 py-2 rounded-pill shadow-sm" style={{ color: '#7C3AED' }}>
                  ⚡ TEEN POCKET-FRIENDLY PASSES
                </span>
                
                <h3 className="brand-font fw-bold mb-1">
                  {isLimitReached ? '🔒 Prompt Limit Reached! Upgrade Pass' : '🚀 AI Coach Subscription Center'}
                </h3>
                <p className="mb-0 text-white-50 small" style={{ maxWidth: '560px', margin: '0 auto' }}>
                  Choose daily, weekly, or **monthly plans based on your prompt limit requirements** (100, 200, or 500 prompts/month)!
                </p>
              </div>

              <div className="modal-body p-4">
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-5"
                  >
                    <div className="display-1 mb-3">🎉</div>
                    <h3 className="brand-font text-purple fw-bold mb-2">Subscription Activated!</h3>
                    <p className="text-muted">
                      Welcome to <strong>{SUBSCRIPTION_PLANS[selectedPlanId]?.name}</strong>! Your AI prompt limit is now {SUBSCRIPTION_PLANS[selectedPlanId]?.promptLimit} prompts/{SUBSCRIPTION_PLANS[selectedPlanId]?.period}! 🚀
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* SECTION 1: CURRENT ACTIVE PLAN DISPLAYED FIRST */}
                    <div className="p-3 mb-4 rounded-4 border bg-purple-subtle border-purple shadow-sm position-relative overflow-hidden" style={{ borderColor: '#8B5CF6' }}>
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="rounded-circle p-3 text-white d-flex align-items-center justify-content-center flex-shrink-0 shadow" 
                            style={{ background: currentPlan.color || '#7C3AED', width: '52px', height: '52px', fontSize: '1.4rem' }}
                          >
                            ⚡
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                              <span className="badge text-uppercase fw-bold px-2 py-1 text-white shadow-sm" style={{ backgroundColor: currentPlan.color || '#8B5CF6', fontSize: '0.65rem' }}>
                                {currentPlan.badge || 'ACTIVE PLAN'}
                              </span>
                              <span className="badge bg-success text-white px-2 py-1 rounded-pill fw-bold" style={{ fontSize: '0.65rem' }}>
                                ● CURRENTLY ACTIVE
                              </span>
                              {expiryStatus.isExpiringSoon && (
                                <span className="badge bg-danger text-white px-2 py-1 rounded-pill fw-bold animate-pulse" style={{ fontSize: '0.65rem' }}>
                                  ⏰ EXPIRES IN ~{expiryStatus.hoursRemaining}h (RENEW SOON)
                                </span>
                              )}
                            </div>
                            <h4 className="brand-font fw-bold mb-0 text-dark">{currentPlan.name}</h4>
                            <small className="text-secondary fw-semibold">
                              {subscription.expiryDate 
                                ? `Valid until ${new Date(subscription.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` 
                                : 'Lifetime Free Tier Access'}
                            </small>
                          </div>
                        </div>

                        {/* Usage Progress Badge */}
                        <div className="text-end bg-white p-3 rounded-4 border shadow-sm" style={{ minWidth: '220px' }}>
                          <div className="text-uppercase text-secondary text-xs fw-bold mb-1" style={{ fontSize: '0.7rem' }}>
                            Prompt Allowance ({usageInfo.limitUnit || 'period'})
                          </div>
                          <div className="brand-font fs-4 fw-bold text-purple">
                            {usageInfo.remaining} <span className="fs-6 text-muted font-normal">/ {usageInfo.limit} left</span>
                          </div>
                          <div className="progress mt-1" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-purple" 
                              role="progressbar" 
                              style={{ 
                                width: `${Math.min(100, (usageInfo.count / usageInfo.limit) * 100)}%`,
                                backgroundColor: '#8B5CF6'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: CATEGORY FILTER TABS (All / Daily & Weekly / Monthly Tiers) */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                      <h5 className="brand-font text-dark mb-0 d-flex align-items-center gap-2">
                        <i className="bi bi-rocket-takeoff-fill text-purple"></i> Select Upgrade Plan
                      </h5>

                      <div className="btn-group bg-light p-1 rounded-pill border shadow-sm">
                        <button
                          className={`btn btn-sm rounded-pill px-3 fw-bold ${activeCategoryFilter === 'all' ? 'btn-purple text-white shadow-sm' : 'btn-light text-secondary'}`}
                          style={{ backgroundColor: activeCategoryFilter === 'all' ? '#8B5CF6' : undefined }}
                          onClick={() => setActiveCategoryFilter('all')}
                        >
                          All Passes
                        </button>
                        <button
                          className={`btn btn-sm rounded-pill px-3 fw-bold ${activeCategoryFilter === 'daily_weekly' ? 'btn-purple text-white shadow-sm' : 'btn-light text-secondary'}`}
                          style={{ backgroundColor: activeCategoryFilter === 'daily_weekly' ? '#8B5CF6' : undefined }}
                          onClick={() => setActiveCategoryFilter('daily_weekly')}
                        >
                          Daily & Weekly
                        </button>
                        <button
                          className={`btn btn-sm rounded-pill px-3 fw-bold ${activeCategoryFilter === 'monthly' ? 'btn-purple text-white shadow-sm' : 'btn-light text-secondary'}`}
                          style={{ backgroundColor: activeCategoryFilter === 'monthly' ? '#8B5CF6' : undefined }}
                          onClick={() => setActiveCategoryFilter('monthly')}
                        >
                          🗓️ Monthly Passes (Choose Prompt Limit)
                        </button>
                      </div>
                    </div>

                    {/* Plan Cards Grid */}
                    <div className="row g-3 mb-4">
                      {displayedPlans.map((plan, index) => {
                        const isCurrent = currentPlanId === plan.id;
                        const isSelected = selectedPlanId === plan.id;

                        return (
                          <div key={plan.id} className="col-12 col-md-6 col-lg-4">
                            <motion.div 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.06 }}
                              whileHover={{ scale: isCurrent ? 1 : 1.03 }}
                              whileTap={{ scale: isCurrent ? 1 : 0.97 }}
                              className={`card h-100 border-2 rounded-4 p-3 position-relative transition-all ${
                                isCurrent 
                                  ? 'border-success bg-success-subtle opacity-90' 
                                  : isSelected 
                                  ? 'shadow-lg border-purple bg-purple-subtle' 
                                  : 'border-light-subtle hover-shadow'
                              }`}
                              style={{
                                borderColor: isCurrent ? '#10B981' : isSelected ? '#8B5CF6' : undefined,
                                backgroundColor: isCurrent ? 'rgba(16, 185, 129, 0.06)' : isSelected ? 'rgba(139, 92, 246, 0.06)' : undefined,
                                cursor: isCurrent ? 'default' : 'pointer'
                              }}
                              onClick={() => {
                                if (!isCurrent) setSelectedPlanId(plan.id);
                              }}
                            >
                              {plan.badge && (
                                <span 
                                  className="position-absolute top-0 start-50 translate-middle badge rounded-pill shadow-sm text-uppercase fw-bold"
                                  style={{ backgroundColor: isCurrent ? '#10B981' : plan.color, fontSize: '0.65rem' }}
                                >
                                  {isCurrent ? 'ACTIVE PLAN' : plan.badge}
                                </span>
                              )}

                              <div className="text-center mt-2">
                                <h6 className="fw-bold mb-1">{plan.name}</h6>
                                <div className="my-2">
                                  <span className="fs-3 fw-extrabold text-dark">
                                    {plan.price === 0 ? 'FREE' : `₹${plan.price}`}
                                  </span>
                                  {plan.price > 0 && <span className="text-muted small">/{plan.period}</span>}
                                </div>

                                <div className="badge bg-purple text-white mb-1 px-3 py-1.5 rounded-pill shadow-sm fs-6" style={{ backgroundColor: '#8B5CF6' }}>
                                  ⚡ {plan.promptLimit} Prompts / {plan.period}
                                </div>
                                {plan.valueTag && (
                                  <div className="text-success fw-bold small mb-2" style={{ fontSize: '0.72rem' }}>
                                    💡 {plan.valueTag}
                                  </div>
                                )}
                                
                                <p className="text-muted small mb-0 mt-1" style={{ fontSize: '0.78rem', minHeight: '36px' }}>
                                  {plan.description}
                                </p>
                              </div>

                              <div className="mt-3 text-center">
                                {isCurrent ? (
                                  <span className="badge bg-success rounded-pill w-100 py-2">● Active Plan</span>
                                ) : (
                                  <button 
                                    className={`btn btn-xs rounded-pill w-100 fw-bold ${
                                      isSelected ? 'btn-purple text-white shadow-sm' : 'btn-outline-purple'
                                    }`}
                                    style={{ fontSize: '0.78rem', backgroundColor: isSelected ? '#8B5CF6' : undefined }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPlanId(plan.id);
                                    }}
                                  >
                                    {isSelected ? 'Selected for Upgrade' : 'Select Plan'}
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Selected Plan Details & Payment Methods */}
                    {selectedPlanId !== currentPlanId && targetPlan && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-light rounded-4 border mb-3 shadow-sm"
                      >
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                          <div>
                            <h6 className="fw-bold mb-0 text-dark">
                              Upgrading to {targetPlan.name} (⚡ {targetPlan.promptLimit} Prompts/{targetPlan.period})
                            </h6>
                            <span className="text-muted small">Select payment method below:</span>
                          </div>
                          <div className="fw-bold fs-4 text-purple">
                            Total: ₹{targetPlan.price}
                          </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className={`btn btn-sm flex-fill rounded-pill py-2 border ${
                              paymentMethod === 'wallet' ? 'btn-purple text-white' : 'btn-outline-secondary'
                            }`}
                            style={{ backgroundColor: paymentMethod === 'wallet' ? '#8B5CF6' : undefined }}
                            onClick={() => setPaymentMethod('wallet')}
                          >
                            👛 Gullak Wallet (Bal: ₹{user.totalSaved.toLocaleString('en-IN')})
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm flex-fill rounded-pill py-2 border ${
                              paymentMethod === 'upi' ? 'btn-purple text-white' : 'btn-outline-secondary'
                            }`}
                            style={{ backgroundColor: paymentMethod === 'upi' ? '#8B5CF6' : undefined }}
                            onClick={() => setPaymentMethod('upi')}
                          >
                            📱 Instant UPI / GPay
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm flex-fill rounded-pill py-2 border ${
                              paymentMethod === 'parent' ? 'btn-purple text-white' : 'btn-outline-secondary'
                            }`}
                            style={{ backgroundColor: paymentMethod === 'parent' ? '#8B5CF6' : undefined }}
                            onClick={() => setPaymentMethod('parent')}
                          >
                            👨‍👩‍👦 Send Parent Link ({user.parentName ? user.parentName.split(' ')[0] : 'Parent'})
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {!isSuccess && (
                <div className="modal-footer border-top bg-light p-3 d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    🛡️ Cancel anytime. Safe & transparent pocket money limits.
                  </span>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
                      Close
                    </button>
                    {selectedPlanId !== currentPlanId && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        className="btn text-white rounded-pill px-4 fw-bold shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}
                        onClick={handleSubscribe}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Activating...
                          </>
                        ) : (
                          `Confirm & Pay ₹${targetPlan?.price}`
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}

      {/* UPI Payment Modal Gateway */}
      <UPIPaymentModal
        isOpen={showUpiModal}
        onClose={() => setShowUpiModal(false)}
        amount={targetPlan?.price || 0}
        title={`Upgrade to ${targetPlan?.name}`}
        description="GullakGo Pro Teen Pass Subscription"
        onSuccess={handleUpiSuccess}
      />
    </AnimatePresence>
  );
}
