import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp, SUBSCRIPTION_PLANS } from '../context/AppContext';
import UPIPaymentModal from './UPIPaymentModal';

export default function SubscriptionModal({ isOpen, onClose, isLimitReached = false }) {
  const { subscription, subscribeToPlan, recordPayment, user } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState('weekly');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'wallet' | 'upi' | 'parent'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);

  const currentPlanId = subscription?.planId || 'free';
  const plans = Object.values(SUBSCRIPTION_PLANS);
  const targetPlan = SUBSCRIPTION_PLANS[selectedPlanId];

  const handleSubscribe = () => {
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="modal-content border-0 rounded-4 shadow-lg overflow-hidden style-modal bg-white text-dark"
            >
              
              {/* Header Banner */}
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
                  {isLimitReached ? '🔒 Daily AI Prompt Limit Reached!' : '🚀 Upgrade Your AI Coach Pass'}
                </h3>
                <p className="mb-0 text-white-50 small" style={{ maxWidth: '520px', margin: '0 auto' }}>
                  {isLimitReached
                    ? 'You have used all your free AI prompts for today. Upgrade now for uninterrupted guidance, savings tips & budget audits!'
                    : 'Get tailored advice, 50-200 daily prompts, streak protection, and deep spending analytics.'}
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
                      Welcome to <strong>{SUBSCRIPTION_PLANS[selectedPlanId]?.name}</strong>! Your daily AI prompts have been recharged! 🚀
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Plan Selection Cards */}
                    <div className="row g-3 mb-4">
                      {plans.map((plan, index) => {
                        const isCurrent = currentPlanId === plan.id;
                        const isSelected = selectedPlanId === plan.id;

                        return (
                          <div key={plan.id} className="col-12 col-md-6 col-lg-3">
                            <motion.div 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className={`card h-100 border-2 rounded-4 p-3 position-relative cursor-pointer transition-all ${
                                isSelected ? 'shadow-lg border-purple bg-purple-subtle' : 'border-light-subtle hover-shadow'
                              }`}
                              style={{
                                borderColor: isSelected ? '#8B5CF6' : undefined,
                                backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.06)' : undefined,
                                cursor: 'pointer'
                              }}
                              onClick={() => setSelectedPlanId(plan.id)}
                            >
                              {plan.badge && (
                                <span 
                                  className="position-absolute top-0 start-50 translate-middle badge rounded-pill shadow-sm text-uppercase fw-bold"
                                  style={{ backgroundColor: plan.color, fontSize: '0.65rem' }}
                                >
                                  {plan.badge}
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

                                <div className="badge bg-light text-dark border mb-2 px-2 py-1 rounded-pill small">
                                  ⚡ {plan.dailyLimit} Prompts / day
                                </div>
                                
                                <p className="text-muted small mb-0" style={{ fontSize: '0.75rem', minHeight: '36px' }}>
                                  {plan.description}
                                </p>
                              </div>

                              <div className="mt-3 text-center">
                                {isCurrent ? (
                                  <span className="badge bg-secondary rounded-pill w-100 py-2">Current Plan</span>
                                ) : (
                                  <div className={`form-check d-flex justify-content-center m-0`}>
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="subscriptionPlan"
                                      checked={isSelected}
                                      onChange={() => setSelectedPlanId(plan.id)}
                                    />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Selected Plan Details & Payment Methods */}
                    {selectedPlanId !== 'free' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-light rounded-4 border mb-3"
                      >
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                          <div>
                            <h6 className="fw-bold mb-0">Payment Option (Teen Friendly)</h6>
                            <span className="text-muted small">Pay from your Gullak Wallet, UPI, or ask parent for allowance link</span>
                          </div>
                          <div className="fw-bold fs-5 text-purple">
                            Total: ₹{SUBSCRIPTION_PLANS[selectedPlanId]?.price}
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
                          `Confirm & Pay ₹${SUBSCRIPTION_PLANS[selectedPlanId]?.price}`
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

