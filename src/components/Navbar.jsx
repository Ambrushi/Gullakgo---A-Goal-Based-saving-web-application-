import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, themeMode, toggleTheme, logout } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { path: '/goals', label: 'Savings Goals', icon: 'bi-piggy-bank-fill' },
    { path: '/expenses', label: 'Expenses', icon: 'bi-receipt-cutoff' },
    { path: '/ai-coach', label: 'AI Coach 🤖', icon: 'bi-robot' }
  ];

  const handleLogout = () => {
    setMobileDrawerOpen(false);
    logout();
    navigate('/landing');
  };

  return (
    <>
      {/* Mobile Top Header Bar (< 768px) */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`d-md-none border-bottom shadow-sm sticky-top px-3 py-2 transition-all ${
          isScrolled ? 'glass-panel bg-body-tertiary' : 'bg-body'
        }`}
      >
        <div className="d-flex align-items-center justify-content-between">
          {/* Brand Logo */}
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="d-flex align-items-center justify-content-center text-white rounded-circle fw-bold shadow-sm"
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                fontSize: '1.1rem'
              }}
            >
              🪙
            </motion.div>
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
            <motion.button 
              whileTap={{ scale: 0.85 }}
              className="theme-toggle-btn p-1 px-2" 
              onClick={toggleTheme}
              title="Toggle Day/Night Mode"
              style={{ fontSize: '0.8rem' }}
            >
              <i className={`bi ${themeMode === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-purple'}`}></i>
            </motion.button>

            {/* Hamburger Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="btn btn-sm btn-outline-purple rounded-circle p-1 d-flex align-items-center justify-content-center"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              style={{ width: '34px', height: '34px' }}
              title="Open Navigation Menu"
            >
              <i className={`bi ${mobileDrawerOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Animated Mobile Off-Canvas Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-drawer-overlay d-md-none"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-drawer-content d-md-none"
            >
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-3">{user.avatar}</span>
                  <div>
                    <h6 className="fw-bold mb-0">{user.name}</h6>
                    <span className="text-muted small">@{user.username || 'gullak_star'}</span>
                  </div>
                </div>
                <button
                  className="btn-close"
                  onClick={() => setMobileDrawerOpen(false)}
                ></button>
              </div>

              <div className="d-flex flex-column gap-2 mb-4">
                {navLinks.map((link, idx) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none fw-semibold transition-all ${
                          isActive ? 'bg-purple-subtle text-purple fs-6' : 'text-dark'
                        }`}
                      >
                        <i className={`bi ${link.icon} fs-5`}></i>
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto pt-3 border-top d-flex flex-column gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="btn btn-outline-purple rounded-pill w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-person-circle"></i> Profile & Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger rounded-pill w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-box-arrow-right"></i> Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Header Navbar (>= 768px) */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`navbar border-bottom shadow-sm sticky-top d-none d-md-block py-2 transition-all ${
          isScrolled ? 'backdrop-blur bg-body-tertiary shadow' : 'bg-body'
        }`}
      >
        <div className="container-fluid container-xl">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 me-xl-3 me-2 flex-shrink-0">
            <motion.div 
              whileHover={{ rotate: 20, scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="d-flex align-items-center justify-content-center text-white rounded-circle fw-bold shadow-sm flex-shrink-0"
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                fontSize: '1.1rem'
              }}
            >
              🪙
            </motion.div>
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

          {/* Right Action Widgets */}
          <div className="d-flex align-items-center gap-2 ms-auto flex-shrink-0">
            {/* Day / Night Theme Toggle */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="theme-toggle-btn text-nowrap px-2.5" 
              onClick={toggleTheme}
              title="Toggle Day/Night Mode"
              style={{ height: '36px', fontSize: '0.85rem' }}
            >
              <i className={`bi ${themeMode === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-purple'}`}></i>
              <span className="small font-semibold text-nowrap d-none d-xl-inline">{themeMode === 'dark' ? 'Day' : 'Night'}</span>
            </motion.button>

            {/* Streak Flame Badge */}
            <motion.div 
              whileHover={{ scale: 1.08 }}
              className="streak-badge text-nowrap" 
              style={{ fontSize: '0.8rem', height: '36px', padding: '0.3rem 0.65rem' }}
            >
              <i className="bi bi-fire text-warning fs-6"></i>
              <span className="text-nowrap">{user.globalStreak}d Streak</span>
            </motion.div>

            {/* User Profile Quick Snippet */}
            <motion.div whileHover={{ scale: 1.03 }}>
              <Link 
                to="/profile" 
                className="text-decoration-none d-flex align-items-center gap-1.5 px-2.5 rounded-pill bg-body-tertiary border text-nowrap" 
                style={{ height: '36px', maxWidth: '140px' }}
                title="Go to Profile"
              >
                <span className="fs-6">{user.avatar}</span>
                <span className="fw-semibold text-dark small text-nowrap text-truncate">{user.name.split(' ')[0]}</span>
              </Link>
            </motion.div>

            {/* Logout / Switch User */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0"
              onClick={handleLogout}
              title="Log out"
              style={{ width: '36px', height: '36px' }}
            >
              <i className="bi bi-box-arrow-right fs-6"></i>
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

