import React from 'react';
import Navbar from './Navbar';
import BottomTabBar from './BottomTabBar';

export default function Layout({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
