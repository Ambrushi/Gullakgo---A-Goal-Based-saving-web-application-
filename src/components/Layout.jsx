import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import BottomTabBar from './BottomTabBar';

export default function Layout({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="flex-grow-1"
      >
        {children}
      </motion.main>
      <BottomTabBar />
    </div>
  );
}

