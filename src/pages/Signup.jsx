import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, themeMode, toggleTheme } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = signUp({
      name: name.trim(),
      mobile: cleanMobile,
      email: email.trim(),
      password
    });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Failed to create account');
    }
  };

  return (
    <div className="auth-page-bg">
      {/* Background Animated Glow Orbs */}
      <div className="auth-orb-1"></div>
      <div className="auth-orb-2"></div>

      <div className="container py-4" style={{ maxWidth: '960px' }}>
        {/* Top Header Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4 px-2">
          <Link to="/landing" className="text-decoration-none d-flex align-items-center gap-2">
            <div 
              className="d-flex align-items-center justify-content-center text-white rounded-circle fw-bold shadow-lg"
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                fontSize: '1.25rem'
              }}
            >
              🪙
            </div>
            <div>
              <span className="brand-font text-dark fs-3 mb-0">Gullak</span>
              <span className="brand-font fs-3 text-purple">Go</span>
            </div>
          </Link>

          <button className="theme-toggle-btn shadow-sm" onClick={toggleTheme}>
            <i className={`bi ${themeMode === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-purple'}`}></i>
            <span className="small font-semibold">{themeMode === 'dark' ? 'Day' : 'Night'}</span>
          </button>
        </div>

        {/* Responsive Glass Card Layout */}
        <div className="glass-auth-card p-4 p-md-5">
          <div className="row g-4 align-items-center">
            
            {/* Left Column Showcase (Visible on lg screens) */}
            <div className="d-none d-lg-block col-lg-5">
              <div className="auth-side-card shadow-lg">
                <div>
                  <div className="d-inline-flex align-items-center justify-content-center p-3 bg-white text-purple rounded-circle mb-4 shadow" style={{ width: '60px', height: '60px', fontSize: '1.8rem' }}>
                    🪙
                  </div>
                  <h3 className="brand-font text-white mb-2">Chota Gullak, Bada Dream! 🚀</h3>
                  <p className="text-white-50 small mb-4">
                    Join over 50,000+ young savers building financial discipline effortlessly.
                  </p>
                </div>

                <div className="d-flex flex-column gap-3 my-4">
                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-4 backdrop-blur">
                    <i className="bi bi-target fs-4 text-warning"></i>
                    <div>
                      <div className="fw-bold text-white small">Goal-Based Gullak</div>
                      <div className="text-white-50 text-xs" style={{ fontSize: '0.75rem' }}>Save for PS5, sneakers & trips</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-4 backdrop-blur">
                    <i className="bi bi-fire fs-4 text-warning"></i>
                    <div>
                      <div className="fw-bold text-white small">Daily Flame Streaks</div>
                      <div className="text-white-50 text-xs" style={{ fontSize: '0.75rem' }}>Build savings muscle every day</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-4 backdrop-blur">
                    <i className="bi bi-robot fs-4 text-info"></i>
                    <div>
                      <div className="fw-bold text-white small">Gemini AI Coach</div>
                      <div className="text-white-50 text-xs" style={{ fontSize: '0.75rem' }}>Pocket-friendly budget guidance</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-top border-white border-opacity-25 small text-white-50">
                  🇮🇳 Made for Gen Z & Teens in India
                </div>
              </div>
            </div>

            {/* Right Column Form */}
            <div className="col-12 col-lg-7">
              <div className="px-md-3 py-2">
                <div className="mb-4">
                  <span className="badge bg-purple-subtle px-3 py-1.5 rounded-pill fw-bold mb-2">
                    START YOUR SAVINGS JOURNEY ✨
                  </span>
                  <h2 className="brand-font mb-1 text-dark">Create Account</h2>
                  <p className="text-secondary small mb-0">Fill in your details below to launch your GullakGo account.</p>
                </div>

                {error && (
                  <div className="alert alert-danger border-0 rounded-4 small p-3 mb-4 d-flex align-items-center gap-2 shadow-sm">
                    <i className="bi bi-exclamation-triangle-fill fs-5 flex-shrink-0 text-danger"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-12">
                      <label className="form-label text-secondary small fw-semibold">Full Name</label>
                      <div className="input-group glass-input-group">
                        <span className="input-group-text bg-transparent border-0 px-3">
                          <i className="bi bi-person text-purple fs-5"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-0 bg-transparent py-2.5 fs-6"
                          placeholder="e.g. Aarav Sharma"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary small fw-semibold">Mobile No (Sign-in ID)</label>
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

                    {/* Email ID */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary small fw-semibold">Mail ID (Email)</label>
                      <div className="input-group glass-input-group">
                        <span className="input-group-text bg-transparent border-0 px-3">
                          <i className="bi bi-envelope text-purple fs-5"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-0 bg-transparent py-2.5 fs-6"
                          placeholder="aarav@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary small fw-semibold">Password</label>
                      <div className="input-group glass-input-group">
                        <span className="input-group-text bg-transparent border-0 px-3">
                          <i className="bi bi-lock text-purple fs-5"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control border-0 bg-transparent py-2.5 fs-6"
                          placeholder="Min 6 characters"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary small fw-semibold">Confirm Password</label>
                      <div className="input-group glass-input-group">
                        <span className="input-group-text bg-transparent border-0 px-3">
                          <i className="bi bi-shield-lock text-purple fs-5"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control border-0 bg-transparent py-2.5 fs-6"
                          placeholder="Repeat password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
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
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-stash-primary w-100 py-3 fs-6 mt-4 shadow-lg">
                    Launch My Gullak 🚀
                  </button>
                </form>

                <div className="text-center border-top pt-3 mt-4">
                  <span className="text-secondary small">Already have an account? </span>
                  <Link to="/login" className="text-purple text-decoration-none fw-bold small">
                    Sign In with Mobile No <i className="bi bi-arrow-right-short"></i>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
