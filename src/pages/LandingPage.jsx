import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, themeMode, toggleTheme } = useApp();

  const handleQuickDemoLogin = () => {
    login('Aarav Sharma');
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Top Marketing Navigation Header */}
      <nav className="navbar navbar-expand-lg border-bottom sticky-top bg-white">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <div 
              className="d-flex align-items-center justify-content-center text-white rounded-circle fw-bold shadow-sm"
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
              <span className="brand-font text-dark fs-4 mb-0 me-0">Gullak</span>
              <span className="brand-font fs-4" style={{ color: '#8B5CF6' }}>Go</span>
            </div>
          </Link>

          <div className="d-flex align-items-center gap-2">
            {/* Theme Toggle Button */}
            <button className="theme-toggle-btn me-2" onClick={toggleTheme}>
              <i className={`bi ${themeMode === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-purple'}`}></i>
              <span className="d-none d-sm-inline">{themeMode === 'dark' ? 'Day Mode' : 'Night Mode'}</span>
            </button>

            {isAuthenticated ? (
              <Link to="/" className="btn btn-stash-primary">
                Open Dashboard <i className="bi bi-arrow-right"></i>
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-stash-secondary">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-stash-primary">
                  Sign Up 🚀
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.02) 100%)' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <span className="badge bg-purple-subtle px-3 py-2 rounded-pill fw-bold mb-3">
                🇮🇳 #1 Savings & Goal Tracker App for Gen Z & Teens
              </span>
              <h1 className="brand-font display-4 fw-extrabold text-dark mb-3" style={{ lineHeight: '1.2' }}>
                Chota Gullak, <span style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bada Dream! 🚀</span>
              </h1>
              <p className="lead text-secondary mb-4 fs-5">
                Save for a PlayStation 5, concert tickets, or new kicks with <strong>GullakGo</strong>. Track daily streaks 🔥, log expenses, and get parents to match your Gullak savings!
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/onboarding" className="btn btn-stash-primary btn-lg px-4 py-3 shadow">
                  Start Your First Goal 🎯
                </Link>
                <button className="btn btn-stash-secondary btn-lg px-4 py-3" onClick={handleQuickDemoLogin}>
                  Explore Interactive App <i className="bi bi-play-circle-fill text-purple ms-1"></i>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="d-flex align-items-center gap-4 pt-2 border-top">
                <div>
                  <div className="fw-bold fs-5 text-dark">50,000+</div>
                  <div className="text-secondary small">Active Savers</div>
                </div>
                <div className="vr"></div>
                <div>
                  <div className="fw-bold fs-5 text-purple">₹2.5 Cr+</div>
                  <div className="text-secondary small">Saved in Gullaks</div>
                </div>
                <div className="vr"></div>
                <div>
                  <div className="fw-bold fs-5 text-warning">4.9 ★★★★★</div>
                  <div className="text-secondary small">Youth Rating</div>
                </div>
              </div>
            </div>

            {/* Interactive Showcase Graphic */}
            <div className="col-12 col-lg-6 text-center">
              <div className="stash-card p-4 p-md-5 mx-auto shadow-lg position-relative" style={{ maxWidth: '440px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge-product category-badge"><i className="bi bi-controller"></i> Product Goal</span>
                  <div className="streak-badge"><i className="bi bi-fire text-warning"></i> 8d Streak</div>
                </div>
                
                <h3 className="brand-font text-dark mb-1">PlayStation 5 Digital</h3>
                <div className="text-purple fw-bold fs-4 mb-3">₹32,000 <span className="text-secondary fs-6 font-normal">/ ₹45,000</span></div>

                <div className="stash-progress-container mb-3" style={{ height: '16px' }}>
                  <div className="stash-progress-bar" style={{ width: '71%' }}></div>
                </div>

                <div className="d-flex justify-content-between text-secondary small fw-semibold mb-4">
                  <span>71% Completed</span>
                  <span>74 Days Remaining</span>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-stash-primary flex-grow-1" onClick={handleQuickDemoLogin}>
                    + ₹500 Streak Add
                  </button>
                  <button className="btn btn-stash-teal" onClick={handleQuickDemoLogin}>
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-5 bg-body">
        <div className="container py-4">
          <div className="text-center mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <span className="badge bg-purple-subtle px-3 py-1 rounded-pill fw-bold mb-2">
              Why Teen Savers & Parents Love GullakGo
            </span>
            <h2 className="brand-font display-6 text-dark">Built for Fun, Discipline & Financial Independence</h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="stash-card p-4 h-100">
                <div className="rounded-circle p-3 d-inline-flex mb-3 text-white" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}>
                  <i className="bi bi-bullseye fs-3"></i>
                </div>
                <h4 className="brand-font text-dark mb-2">Goal-Based Gullaks</h4>
                <p className="text-secondary small mb-0">
                  Set specific target amounts in Indian Rupees (₹) for sneakers, electronics, or movies. Watch your progress ring grow!
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="stash-card p-4 h-100">
                <div className="rounded-circle p-3 d-inline-flex mb-3 text-white" style={{ background: 'linear-gradient(135deg, #FF4500 0%, #F59E0B 100%)' }}>
                  <i className="bi bi-fire fs-3"></i>
                </div>
                <h4 className="brand-font text-dark mb-2">Daily Streak Gamification</h4>
                <p className="text-secondary small mb-0">
                  Save daily or weekly to maintain your flame streak. Level up your profile badge from Rookie to Savings Champion!
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="stash-card p-4 h-100">
                <div className="rounded-circle p-3 d-inline-flex mb-3 text-white" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #84CC16 100%)' }}>
                  <i className="bi bi-shield-check fs-3"></i>
                </div>
                <h4 className="brand-font text-dark mb-2">Parent Sponsorship</h4>
                <p className="text-secondary small mb-0">
                  Link a guardian account so parents can sponsor your savings, send matching deposit bonuses, and encourage smart habits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Day / Night Mode Feature Callout */}
      <section className="py-5 bg-body">
        <div className="container py-3">
          <div className="gradient-callout-card p-4 p-md-5 d-flex flex-wrap align-items-center justify-content-between gap-4">
            <div style={{ maxWidth: '500px' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-moon-stars-fill text-warning fs-4"></i>
                <span className="badge bg-warning text-dark rounded-pill fw-bold">Day & Night Mode Included</span>
              </div>
              <h3 className="brand-font text-white mb-2">Sleek Design in Any Lighting 🌙</h3>
              <p className="mb-0">
                Switch seamlessly between light and dark themes on GullakGo. Designed for comfort day or night!
              </p>
            </div>
            <button className="btn btn-light btn-lg rounded-pill fw-bold text-purple px-4 py-3" onClick={toggleTheme}>
              Try {themeMode === 'dark' ? 'Light Theme ☀️' : 'Dark Theme 🌙'}
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="mt-auto py-4 border-top text-center text-secondary small bg-white">
        <div className="container">
          <div className="brand-font fs-4 text-dark mb-1">
            Gullak<span style={{ color: '#8B5CF6' }}>Go</span> 🪙
          </div>
          <p className="mb-3">Empowering young minds with smart goal-based savings & financial habits.</p>
          <div className="d-flex justify-content-center gap-3 mb-3">
            <Link to="/onboarding" className="text-purple text-decoration-none fw-bold">Get Started</Link> |
            <button className="btn btn-link text-purple p-0 fw-bold text-decoration-none" onClick={handleQuickDemoLogin}>Launch App</button>
          </div>
          <p className="text-muted mb-0">© 2026 GullakGo Inc. Built for teens & kids in India 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}
