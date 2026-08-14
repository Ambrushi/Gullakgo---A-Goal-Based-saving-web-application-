import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';

export default function ExpenseTracker() {
  const { expenses, addExpense } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Snacks & Drinks');

  const categories = [
    { label: 'Snacks & Drinks', icon: 'bi-cup-straw', color: '#EC4899' },
    { label: 'Gaming', icon: 'bi-controller', color: '#8B5CF6' },
    { label: 'Books & School', icon: 'bi-book', color: '#38BDF8' },
    { label: 'Outings', icon: 'bi-ticket-detailed', color: '#F59E0B' },
    { label: 'Shopping', icon: 'bi-bag', color: '#14B8A6' }
  ];

  // Calculate Total Spent
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by Category for Pie Chart
  const chartDataMap = {};
  expenses.forEach(exp => {
    chartDataMap[exp.category] = (chartDataMap[exp.category] || 0) + exp.amount;
  });

  const chartData = Object.keys(chartDataMap).map(catName => {
    const catObj = categories.find(c => c.label === catName) || { color: '#64748B' };
    return {
      name: catName,
      value: parseFloat(chartDataMap[catName].toFixed(2)),
      color: catObj.color
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const catObj = categories.find(c => c.label === category) || categories[0];

    addExpense({
      title,
      amount: parseFloat(amount),
      category,
      icon: catObj.icon
    });

    setTitle('');
    setAmount('');
    setShowAddForm(false);
  };

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      {/* Top Title & Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="brand-font mb-0 text-dark">Daily Expense Tracker 💸</h2>
          <p className="text-secondary small mb-0">Track where your money goes in Indian Rupees (₹) to stay on budget!</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-stash-primary d-inline-flex align-items-center gap-2"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <i className={`bi ${showAddForm ? 'bi-x-lg' : 'bi-plus-lg'}`}></i>
          {showAddForm ? 'Close' : 'Log Expense'}
        </motion.button>
      </div>

      {/* Log Expense Form Box (Collapsible / Toggleable) */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-4"
          >
            <div className="stash-card p-4 border-purple" style={{ borderColor: '#8B5CF6' }}>
              <h5 className="brand-font mb-3 text-dark">Add New Expense Item 🛒</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-5">
                    <label className="form-label text-secondary small fw-semibold">Item Title</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Samosa & Cold Coffee"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label text-secondary small fw-semibold">Amount (₹)</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      className="form-control rounded-3"
                      placeholder="150"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-4">
                    <label className="form-label text-secondary small fw-semibold">Category</label>
                    <select
                      className="form-select rounded-3"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      {categories.map(c => (
                        <option key={c.label} value={c.label}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 text-end">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit" 
                      className="btn btn-stash-primary px-4"
                    >
                      Save Expense
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spending Breakdown & Chart Section */}
      <div className="row g-4 mb-4">
        {/* Total Summary Card */}
        <div className="col-12 col-md-5">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="stash-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill fw-bold mb-2">
                Monthly Spending
              </span>
              <div className="text-secondary small fw-semibold">Total Expenses Logged</div>
              <div className="brand-font display-5 text-danger fw-bold mb-3">
                ₹{totalSpent.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 bg-light rounded-4">
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-shield-check text-purple fs-5"></i>
                <span className="fw-bold small text-dark">Budget Health</span>
              </div>
              <p className="text-secondary small mb-0">
                You've spent wisely this month! Remember: saving 20% of your allowance accelerates your goals! 🎯
              </p>
            </div>
          </motion.div>
        </div>

        {/* Category Breakdown Recharts Pie Chart */}
        <div className="col-12 col-md-7">
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="stash-card p-4 h-100 text-center">
            <h5 className="brand-font mb-3 text-dark text-start">Spending Breakdown</h5>
            {chartData.length === 0 ? (
              <p className="text-muted py-4">No expenses recorded yet.</p>
            ) : (
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Expense History List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stash-card p-4">
        <h5 className="brand-font mb-3 text-dark">Recent Expense Logs</h5>

        {expenses.length === 0 ? (
          <p className="text-muted text-center py-3">No expenses logged yet.</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            <AnimatePresence>
              {expenses.map((exp, idx) => (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-light"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle p-2 d-flex align-items-center justify-content-center text-purple bg-white shadow-sm"
                      style={{ width: '42px', height: '42px', color: '#8B5CF6' }}
                    >
                      <i className={`bi ${exp.icon} fs-5`}></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{exp.title}</div>
                      <div className="text-muted small">{exp.category} • {exp.date}</div>
                    </div>
                  </div>
                  <span className="fw-bold text-danger fs-6">-₹{exp.amount.toLocaleString('en-IN')}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

