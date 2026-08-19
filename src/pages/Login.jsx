import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithMobile, themeMode, toggleTheme } = useApp();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError('Please enter your 10-digit mobile number');
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const result = await loginWithMobile({
        mobile: cleanMobile,
        password
      });

      setLoading(false);

      if (result && result.success) {
        toast.success('Signed in successfully! Welcome back 🚀');
        navigate('/');
      } else {
        const errMsg = result?.message || 'Invalid Mobile Number or Password';
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      setLoading(false);
      const errMsg = err.message || 'Server error occurred during sign in';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleQuickDemoFill = () => {
    setMobile('9876543210');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="auth-page-bg">
      {/* Background Animated Glow Orbs */}
      <div className="auth-orb-1"></div>
      <div className="auth-orb-2"></div>

      <div className="container py-4" style={{ maxWidth: '920px' }}>
        {/* Top Header Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4 px-2">
          <Link to="/landing" className="text-decoration-none d-flex align-items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="d-flex align-items-center justify-content-center text-white rounded-circle fw-bold shadow-lg"
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                fontSize: '1.25rem'
              }}
            >
              🪙
            </motion.div>
            <div>
              <span className="brand-font text-dark fs-3 mb-0">Gullak</span>
              <span className="brand-font fs-3 text-purple">Go</span>
            </div>
          </Link>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="theme-toggle-btn shadow-sm" 
            onClick={toggleTheme}
          >
            <i className={`bi ${themeMode === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-purple'}`}></i>
            <span className="small font-semibold">{themeMode === 'dark' ? 'Day' : 'Night'}</span>
          </motion.button>
        </div>

        {/* Responsive Glass Card Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-auth-card p-4 p-md-5"
        >
          <div className="row g-4 align-items-center">
            
            {/* Left Column Showcase (Visible on lg screens) */}
            <div className="d-none d-lg-block col-lg-5">
              <div className="auth-side-card shadow-lg">
                <div>
                  <div className="d-inline-flex align-items-center justify-content-center p-3 bg-white text-purple rounded-circle mb-4 shadow animate-float" style={{ width: '60px', height: '60px', fontSize: '1.8rem' }}>
                    🔑
                  </div>
                  <h3 className="brand-font text-white mb-2">Welcome Back! 👋</h3>
                  <p className="text-white-50 small mb-4">
                    Sign in to manage your active savings goals, check daily flames, and chat with AI Coach.
                  </p>
                </div>

                <div className="d-flex flex-column gap-3 my-4">
                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-4 backdrop-blur">
                    <i className="bi bi-shield-check fs-4 text-success"></i>
                    <div>
                      <div className="fw-bold text-white small">Secure Sign-In</div>
                      <div className="text-white-50 text-xs" style={{ fontSize: '0.75rem' }}>Mobile number & password protection</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-4 backdrop-blur">
                    <i className="bi bi-lightning-charge-fill fs-4 text-warning"></i>
                    <div>
                      <div className="fw-bold text-white small">Instant Gullak Access</div>
                      <div className="text-white-50 text-xs" style={{ fontSize: '0.75rem' }}>Track progress ring & total savings</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-top border-white border-opacity-25 small text-white-50">
                  🛡️ Safe & Transparent Teen Pocket Money Platform
                </div>
              </div>
            </div>

            {/* Right Column Form */}
            <div className="col-12 col-lg-7">
              <div className="px-md-3 py-2">
                <div className="mb-4">
                  <span className="badge bg-purple-subtle px-3 py-1.5 rounded-pill fw-bold mb-2">
                    WELCOME BACK 🔑
                  </span>
                  <h2 className="brand-font mb-1 text-dark">Sign In</h2>
                  <p className="text-secondary small mb-0">Enter your Mobile Number & Password to continue.</p>
                </div>

                {error && (
                  <div className="alert alert-danger border-0 rounded-4 small p-3 mb-4 d-flex align-items-center gap-2 shadow-sm">
                    <i className="bi bi-exclamation-triangle-fill fs-5 flex-shrink-0 text-danger"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Mobile Number */}
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-semibold">Mobile Number</label>
                    <div className="input-group glass-input-group">
                      <span className="input-group-text bg-transparent border-0 pe-1 fw-bold text-dark">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        className="form-control border-0 bg-transparent py-2.5 fs-6"
                        placeholder="9876543210"
                        value={mobile}
                        onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label text-secondary small fw-semibold">Password</label>
                    <div className="input-group glass-input-group">
                      <span className="input-group-text bg-transparent border-0 px-3">
                        <i className="bi bi-lock text-purple fs-5"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-0 bg-transparent py-2.5 fs-6"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text bg-transparent border-0 text-secondary pe-3"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash-fill text-purple' : 'bi-eye-fill'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={loading}
                    className="btn btn-stash-primary w-100 py-3 fs-6 mb-3 shadow-lg"
                  >
                    {loading ? (
                      <span><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</span>
                    ) : (
                      'Sign In to Dashboard 🚀'
                    )}
                  </motion.button>
                </form>

                {/* Quick Demo Fill Box */}
                <div className="p-3 bg-white bg-opacity-40 rounded-4 border mb-3 text-center backdrop-blur">
                  <div className="small text-secondary mb-2">Want a 1-click test drive?</div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className="btn btn-sm btn-outline-purple rounded-pill px-3 py-1.5 fw-bold"
                    onClick={handleQuickDemoFill}
                  >
                    ⚡ Fill Demo Credentials (9876543210)
                  </motion.button>
                </div>

                <div className="text-center border-top pt-3">
                  <span className="text-secondary small">Don't have an account yet? </span>
                  <Link to="/signup" className="text-purple text-decoration-none fw-bold small">
                    Create Account <i className="bi bi-arrow-right-short"></i>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
