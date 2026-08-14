import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [linkParent, setLinkParent] = useState(false);
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  const slides = [
    {
      title: "Set Cool Savings Goals 🎯",
      subtitle: "Whether it's a new gaming console, movie tickets, or cool kicks — save up for what you actually love!",
      badge: "Step 1 of 3",
      icon: "bi-rocket-takeoff-fill",
      color: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
    },
    {
      title: "Build Daily Streaks 🔥",
      subtitle: "Add a little money every day or week. Keep your flame burning and unlock awesome level badges!",
      badge: "Step 2 of 3",
      icon: "bi-fire",
      color: "linear-gradient(135deg, #FF4500 0%, #F59E0B 100%)"
    },
    {
      title: "Create Your Account 🚀",
      subtitle: "Join thousands of young savers taking control of their money today!",
      badge: "Step 3 of 3",
      icon: "bi-stars",
      color: "linear-gradient(135deg, #0D9488 0%, #84CC16 100%)"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    completeOnboarding({
      name: name || 'Alex Saver',
      handle: handle ? `@${handle.replace('@', '')}` : '@alex_saver',
      parentLinked: linkParent,
      parentName: linkParent ? parentName : '',
      parentEmail: linkParent ? parentEmail : ''
    });
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="stash-card p-4 p-md-5 w-100 overflow-hidden" 
        style={{ maxWidth: '500px' }}
      >
        
        {/* Progress Dots */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="badge bg-purple-subtle text-purple px-3 py-2 rounded-pill fw-bold" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#7C3AED' }}>
            {slides[step].badge}
          </span>
          <div className="d-flex gap-1">
            {slides.map((_, idx) => (
              <motion.div
                key={idx}
                animate={{ width: idx === step ? 24 : 8 }}
                className="rounded-pill"
                style={{
                  height: '8px',
                  backgroundColor: idx === step ? '#8B5CF6' : '#E2E8F0'
                }}
              />
            ))}
          </div>
        </div>

        {/* Slide Graphic */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="rounded-4 p-4 text-center text-white mb-4 d-flex flex-column align-items-center justify-content-center shadow-sm"
            style={{ background: slides[step].color, minHeight: '160px' }}
          >
            <div className="display-3 mb-2 animate-float">
              <i className={`bi ${slides[step].icon}`}></i>
            </div>
            <h3 className="brand-font mb-0 text-white">{slides[step].title}</h3>
          </motion.div>
        </AnimatePresence>

        {/* Slide Content */}
        {step < 2 ? (
          <div className="text-center py-2">
            <p className="text-secondary fs-6 lead mb-4">
              {slides[step].subtitle}
            </p>
            <div className="d-flex gap-3 justify-content-center">
              {step > 0 && (
                <button className="btn btn-stash-secondary flex-grow-1" onClick={handlePrev}>
                  Back
                </button>
              )}
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="btn btn-stash-primary flex-grow-1" 
                onClick={handleNext}
              >
                Next <i className="bi bi-arrow-right ms-1"></i>
              </motion.button>
            </div>
          </div>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Your Name</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3 fs-6"
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Username</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">@</span>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-end-3 fs-6 border-start-0"
                  placeholder="alex_saver"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Optional Guardian Link Step */}
            <div className="p-3 bg-light rounded-4 border mb-4">
              <div className="form-check form-switch d-flex align-items-center justify-content-between p-0 m-0">
                <label className="form-check-label fw-bold text-dark cursor-pointer m-0 d-flex align-items-center gap-2" htmlFor="parentSwitch">
                  <i className="bi bi-shield-lock-fill text-purple fs-5"></i>
                  Link Parent / Guardian Account?
                </label>
                <input
                  className="form-check-input ms-0 fs-4"
                  type="checkbox"
                  id="parentSwitch"
                  checked={linkParent}
                  onChange={e => setLinkParent(e.target.checked)}
                />
              </div>

              <AnimatePresence>
                {linkParent && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-top overflow-hidden"
                  >
                    <p className="small text-muted mb-2">
                      Linking a guardian lets them sponsor match contributions or send rewards! 🎁
                    </p>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-3"
                        placeholder="Parent/Guardian Full Name"
                        value={parentName}
                        onChange={e => setParentName(e.target.value)}
                        required={linkParent}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        className="form-control form-control-sm rounded-3"
                        placeholder="Parent Email Address"
                        value={parentEmail}
                        onChange={e => setParentEmail(e.target.value)}
                        required={linkParent}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-stash-secondary" onClick={handlePrev}>
                Back
              </button>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                type="submit" 
                className="btn btn-stash-primary flex-grow-1"
              >
                Start Saving Now 🎉
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

