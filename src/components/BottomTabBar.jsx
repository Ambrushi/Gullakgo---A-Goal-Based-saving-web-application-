import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BottomTabBar() {
  const tabs = [
    { path: '/', label: 'Home', icon: 'bi-house-door-fill' },
    { path: '/goals', label: 'Goals', icon: 'bi-target' },
    { path: '/expenses', label: 'Expenses', icon: 'bi-pie-chart-fill' },
    { path: '/ai-coach', label: 'AI Coach', icon: 'bi-robot' },
    { path: '/profile', label: 'Profile', icon: 'bi-person-fill' }
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bottom-tab-bar d-md-none"
    >
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `tab-item text-decoration-none ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.85 }}
              animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
              className="d-flex flex-column align-items-center"
            >
              <i className={`bi ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </motion.div>
          )}
        </NavLink>
      ))}
    </motion.div>
  );
}

