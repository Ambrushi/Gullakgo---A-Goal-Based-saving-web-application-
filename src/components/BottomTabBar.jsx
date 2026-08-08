import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomTabBar() {
  const tabs = [
    { path: '/', label: 'Home', icon: 'bi-house-door-fill' },
    { path: '/goals', label: 'Goals', icon: 'bi-target' },
    { path: '/expenses', label: 'Expenses', icon: 'bi-pie-chart-fill' },
    { path: '/ai-coach', label: 'AI Coach', icon: 'bi-robot' },
    { path: '/profile', label: 'Profile', icon: 'bi-person-fill' }
  ];

  return (
    <div className="bottom-tab-bar d-md-none">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
        >
          <i className={`bi ${tab.icon}`}></i>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
