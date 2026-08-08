import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, themeMode, toggleTheme, logout } = useApp();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { path: '/goals', label: 'Savings Goals', icon: 'bi-piggy-bank-fill' },
    { path: '/expenses', label: 'Expenses', icon: 'bi-receipt-cutoff' },
    { path: '/ai-coach', label: 'AI Coach 🤖', icon: 'bi-robot' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <>
      {/* Mobile Top Header Bar (< 768px) */}
      <header className="d-md-none border-bottom shadow-sm sticky-top bg-body px-3 py-2">
        <div className="d-flex align-items-center justify-content-between">
          {/* Brand Logo */}
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <div 
              className="d-flex align-items-center justify-content-center text-white rounded-circle fw-bold shadow-sm"
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                fontSize: '1.1rem'
              }}
            >
              🪙
            </div>
            <div>
              <span className="brand-font text-dark fs-5 mb-0">Gullak</span>
              <span className="brand-font fs-5 text-purple">Go</span>
            </div>
          </Link>

          {/* Right Mobile Actions */}
          <div className="d-flex align-items-center gap-2">
            {/* Streak Badge */}
            <div className="streak-badge text-nowrap" style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem' }}>
              <i className="bi bi-fire text-warning"></i> {user.globalStreak}d
            </div>

            {/* AI Coach Link */}
            <Link to="/ai-coach" className="btn btn-sm btn-stash-primary px-2 py-1 text-nowrap" style={{ fontSize: '0.8rem' }}>
              🤖 AI
            </Link>

            {/* Day / Night Toggle */}
            <button 
              className="theme-toggle-btn p-1 px-2" 
              onClick={toggleTheme}
              title="Toggle Day/Night Mode"
              style={{ fontSize: '0.8rem' }}
            >
              <i className={`bi ${themeMode === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-purple'}`}></i>
            </button>

            {/* User Avatar Link */}
            <Link to="/profile" className="text-decoration-none d-flex align-items-center justify-content-center rounded-circle bg-light border" style={{ width: '32px', height: '32px' }} title="Profile">
              <span style={{ fontSize: '1rem' }}>{user.avatar}</span>
            </Link>

            {/* Logout */}
            <button
              className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center"
              onClick={handleLogout}
              title="Log out"
              style={{ width: '32px', height: '32px' }}
            >
              <i className="bi bi-box-arrow-right small"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header Navbar (>= 768px) */}
      <nav className="navbar border-bottom shadow-sm sticky-top d-none d-md-block bg-body py-2">
        <div className="container-fluid container-xl">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 me-xl-3 me-2 flex-shrink-0">
            <div 
              className="d-flex align-items-center justify-content-center text-white rounded-circle fw-bold shadow-sm flex-shrink-0"
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                fontSize: '1.1rem'
              }}
            >
              🪙
            </div>
            <div>
              <span className="brand-font text-dark fs-4 mb-0 me-0">Gullak</span>
              <span className="brand-font fs-4 text-purple">Go</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <ul className="navbar-nav flex-row align-items-center gap-1 gap-lg-2 me-auto mb-0">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path} className="nav-item">
                  <Link
                    to={link.path}
                    className={`nav-link fw-semibold px-2.5 px-lg-3 py-1.5 rounded-pill d-flex align-items-center gap-1.5 text-nowrap transition-all ${
                      isActive ? 'active bg-purple-subtle text-purple fw-bold shadow-sm' : 'text-secondary'
                    }`}
                    style={{ fontSize: '0.85rem', height: '36px' }}
                  >
                    <i className={`bi ${link.icon} fs-6`}></i>
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Action Widgets with Clean Gaps */}
          <div className="d-flex align-items-center gap-2 ms-auto flex-shrink-0">
            {/* Day / Night Theme Toggle */}
            <button 
              className="theme-toggle-btn text-nowrap px-2.5" 
              onClick={toggleTheme}
              title="Toggle Day/Night Mode"
              style={{ height: '36px', fontSize: '0.85rem' }}
            >
              <i className={`bi ${themeMode === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-purple'}`}></i>
              <span className="small font-semibold text-nowrap d-none d-xl-inline">{themeMode === 'dark' ? 'Day' : 'Night'}</span>
            </button>

            {/* Streak Flame Badge */}
            <div className="streak-badge text-nowrap" style={{ fontSize: '0.8rem', height: '36px', padding: '0.3rem 0.65rem' }}>
              <i className="bi bi-fire text-warning fs-6"></i>
              <span className="text-nowrap">{user.globalStreak}d Streak</span>
            </div>

            {/* User Profile Quick Snippet */}
            <Link 
              to="/profile" 
              className="text-decoration-none d-flex align-items-center gap-1.5 px-2.5 rounded-pill bg-body-tertiary border text-nowrap" 
              style={{ height: '36px', maxWidth: '140px' }}
              title="Go to Profile"
            >
              <span className="fs-6">{user.avatar}</span>
              <span className="fw-semibold text-dark small text-nowrap text-truncate">{user.name.split(' ')[0]}</span>
            </Link>

            {/* Logout / Switch User */}
            <button
              className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0"
              onClick={handleLogout}
              title="Log out"
              style={{ width: '36px', height: '36px' }}
            >
              <i className="bi bi-box-arrow-right fs-6"></i>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
