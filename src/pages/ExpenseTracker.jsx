import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';

export default function ExpenseTracker() {
  const { expenses, addExpense, deleteExpense } = useApp();

  const getTodayDateStr = () => new Date().toISOString().split('T')[0];

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Snacks & Drinks');
  const [expenseDate, setExpenseDate] = useState(getTodayDateStr());

  // 3-Way View Mode: 'daily' | 'monthly' | 'yearly'
  const [viewMode, setViewMode] = useState('monthly');

  // Filter Selectors for Previous Data
  const todayStr = getTodayDateStr();
  const currentMonthStr = todayStr.substring(0, 7); // 'YYYY-MM'
  const currentYearStr = todayStr.substring(0, 4);  // 'YYYY'

  const [selectedDailyDate, setSelectedDailyDate] = useState(todayStr);
  const [selectedMonthlyDate, setSelectedMonthlyDate] = useState(currentMonthStr);
  const [selectedYearlyDate, setSelectedYearlyDate] = useState(currentYearStr);

  const categories = [
    { label: 'Snacks & Drinks', icon: 'bi-cup-straw', color: '#EC4899' },
    { label: 'Gaming', icon: 'bi-controller', color: '#8B5CF6' },
    { label: 'Books & School', icon: 'bi-book', color: '#38BDF8' },
    { label: 'Outings', icon: 'bi-ticket-detailed', color: '#F59E0B' },
    { label: 'Shopping', icon: 'bi-bag', color: '#14B8A6' }
  ];

  // Helper Date Functions
  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getMonthStr = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.substring(0, 7); // 'YYYY-MM'
  };

  const getYearStr = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.substring(0, 4); // 'YYYY'
  };

  const formatMonthLabel = (monthKey) => {
    if (!monthKey) return '';
    const [y, m] = monthKey.split('-');
    const d = new Date(parseInt(y), parseInt(m) - 1, 1);
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };

  // Filter Expenses according to selected View Mode & Filter Date/Month/Year
  const filteredExpenses = expenses.filter(exp => {
    const expDate = exp.date || todayStr;
    if (viewMode === 'daily') {
      return expDate === selectedDailyDate;
    } else if (viewMode === 'monthly') {
      return getMonthStr(expDate) === selectedMonthlyDate;
    } else if (viewMode === 'yearly') {
      return getYearStr(expDate) === selectedYearlyDate;
    }
    return true;
  });

  // Calculate View Total Spent
  const viewTotalSpent = filteredExpenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const overallTotalSpent = expenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  // Group by Category for Pie Chart (for currently filtered expenses)
  const chartDataMap = {};
  filteredExpenses.forEach(exp => {
    const amt = parseFloat(exp.amount) || 0;
    chartDataMap[exp.category] = (chartDataMap[exp.category] || 0) + amt;
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
      icon: catObj.icon,
      date: expenseDate || todayStr
    });

    setTitle('');
    setAmount('');
    setExpenseDate(getTodayDateStr());
    setShowAddForm(false);
  };

  // Export Expenses to Styled Excel File (.xls)
  const handleDownloadExcel = () => {
    const listToExport = filteredExpenses.length > 0 ? filteredExpenses : expenses;
    if (listToExport.length === 0) {
      alert('No expense items available to export!');
      return;
    }

    const totalAmt = listToExport.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const periodName = viewMode === 'daily' ? selectedDailyDate : viewMode === 'monthly' ? selectedMonthlyDate : selectedYearlyDate;

    // Excel HTML XML content for native Excel rendering with styled columns & gridlines
    let excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Expense Report</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #7C3AED; color: #FFFFFF; font-weight: bold; padding: 10px; border: 1px solid #6D28D9; text-align: left; }
          td { padding: 8px 12px; border: 1px solid #CBD5E1; mso-number-format:"\\@"; }
          .num-cell { text-align: right; font-weight: bold; color: #DC2626; }
          .total-row td { background-color: #F3E8FF; font-weight: bold; color: #6B21A8; border-top: 2px solid #7C3AED; }
          .title-header { background-color: #F5F3FF; font-size: 16px; font-weight: bold; color: #5B21B6; padding: 12px; text-align: center; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td colspan="6" class="title-header">
              GullakGo Expense Report (${viewMode.toUpperCase()} VIEW: ${periodName})
            </td>
          </tr>
          <tr>
            <th style="width: 160px;">Transaction ID</th>
            <th style="width: 130px;">Date</th>
            <th style="width: 140px;">Day of Week</th>
            <th style="width: 220px;">Item Title</th>
            <th style="width: 180px;">Category</th>
            <th style="width: 140px; text-align: right;">Amount (₹)</th>
          </tr>
    `;

    listToExport.forEach((exp, idx) => {
      const dateStr = exp.date || todayStr;
      const dayOfWeek = formatFullDate(dateStr).split(',')[0] || '';
      const formattedDate = dateStr.split('-').reverse().join('-'); // 'DD-MM-YYYY'

      excelHtml += `
        <tr>
          <td>${exp.id || 'e_' + idx}</td>
          <td>${formattedDate}</td>
          <td>${dayOfWeek}</td>
          <td>${exp.title || ''}</td>
          <td>${exp.category || ''}</td>
          <td class="num-cell">₹${(parseFloat(exp.amount) || 0).toLocaleString('en-IN')}</td>
        </tr>
      `;
    });

    excelHtml += `
          <tr class="total-row">
            <td colspan="5" style="text-align: right;">TOTAL EXPENSES (${listToExport.length} Items):</td>
            <td class="num-cell">₹${totalAmt.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `GullakGo_Expense_Report_${viewMode}_${periodName}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get list of available years from expenses
  const availableYears = Array.from(
    new Set([currentYearStr, ...expenses.map(e => getYearStr(e.date || todayStr))])
  ).sort().reverse();

  return (
    <div className="container py-4" style={{ maxWidth: '860px' }}>
      {/* Top Header & Download Action */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="brand-font mb-0 text-dark">Smart Expense Tracker 💸</h2>
          <p className="text-secondary small mb-0">Track, filter, and export your daily, monthly & yearly expenses in Excel format</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn btn-success d-inline-flex align-items-center gap-2 px-3 py-2 text-white fw-bold shadow-sm"
            onClick={handleDownloadExcel}
            title="Export to Excel Spreadsheet (.csv)"
          >
            <i className="bi bi-file-earmark-excel-fill fs-5"></i>
            Export Excel 📊
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn btn-stash-primary d-inline-flex align-items-center gap-2 px-4 py-2"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <i className={`bi ${showAddForm ? 'bi-x-lg' : 'bi-plus-circle-fill'}`}></i>
            {showAddForm ? 'Close' : 'Add Expense Item'}
          </motion.button>
        </div>
      </div>

      {/* Log Expense Form Box */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-4"
          >
            <div className="stash-card p-4 border-purple" style={{ borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.04)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="brand-font mb-0 text-dark">Log New Expense 🛒</h5>
                <span className="badge bg-purple text-white px-3 py-1 rounded-pill small">
                  📅 {formatFullDate(expenseDate)}
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Item Title */}
                  <div className="col-12 col-md-4">
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

                  {/* Amount */}
                  <div className="col-6 col-md-3">
                    <label className="form-label text-secondary small fw-semibold">Amount (₹)</label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0 fw-bold">₹</span>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        className="form-control rounded-end-3 border-start-0"
                        placeholder="150"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-6 col-md-2">
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

                  {/* Expense Date & Day Selector */}
                  <div className="col-12 col-md-3">
                    <label className="form-label text-secondary small fw-semibold">Day & Date</label>
                    <input
                      type="date"
                      className="form-control rounded-3"
                      value={expenseDate}
                      onChange={e => setExpenseDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 text-end pt-2">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit" 
                      className="btn btn-stash-primary px-4 py-2"
                    >
                      <i className="bi bi-check2-circle me-1"></i> Save Expense
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-Way View Mode Switcher + Date/Month/Year Selector Controls */}
      <div className="stash-card p-3 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          
          {/* Mode Switcher Tabs (Daily / Monthly / Yearly) */}
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-dark me-1"><i className="bi bi-funnel-fill text-purple"></i> View Mode:</span>
            <div className="d-flex gap-1 p-1 bg-light rounded-pill border">
              <button
                onClick={() => setViewMode('daily')}
                className={`btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all ${
                  viewMode === 'daily' ? 'btn-purple text-white shadow-sm' : 'text-secondary'
                }`}
                style={{ backgroundColor: viewMode === 'daily' ? '#8B5CF6' : 'transparent' }}
              >
                📅 Daily
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all ${
                  viewMode === 'monthly' ? 'btn-purple text-white shadow-sm' : 'text-secondary'
                }`}
                style={{ backgroundColor: viewMode === 'monthly' ? '#8B5CF6' : 'transparent' }}
              >
                🗓️ Monthly
              </button>
              <button
                onClick={() => setViewMode('yearly')}
                className={`btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all ${
                  viewMode === 'yearly' ? 'btn-purple text-white shadow-sm' : 'text-secondary'
                }`}
                style={{ backgroundColor: viewMode === 'yearly' ? '#8B5CF6' : 'transparent' }}
              >
                📆 Yearly
              </button>
            </div>
          </div>

          {/* Dynamic Date Selector based on View Mode */}
          <div className="d-flex align-items-center gap-2 ms-auto flex-wrap">
            {viewMode === 'daily' && (
              <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-4 border">
                <span className="small fw-semibold text-secondary">Select Day:</span>
                <input
                  type="date"
                  className="form-control form-control-sm rounded-3 fw-bold text-dark border-purple"
                  value={selectedDailyDate}
                  onChange={e => setSelectedDailyDate(e.target.value)}
                  style={{ width: '160px' }}
                />
                <button
                  className="btn btn-xs btn-outline-purple rounded-pill px-2 py-1"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setSelectedDailyDate(todayStr)}
                >
                  Today
                </button>
              </div>
            )}

            {viewMode === 'monthly' && (
              <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-4 border">
                <span className="small fw-semibold text-secondary">Select Month:</span>
                <input
                  type="month"
                  className="form-control form-control-sm rounded-3 fw-bold text-dark border-purple"
                  value={selectedMonthlyDate}
                  onChange={e => setSelectedMonthlyDate(e.target.value)}
                  style={{ width: '170px' }}
                />
                <button
                  className="btn btn-xs btn-outline-purple rounded-pill px-2 py-1"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setSelectedMonthlyDate(currentMonthStr)}
                >
                  Current Month
                </button>
              </div>
            )}

            {viewMode === 'yearly' && (
              <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-4 border">
                <span className="small fw-semibold text-secondary">Select Year:</span>
                <select
                  className="form-select form-select-sm rounded-3 fw-bold text-dark border-purple"
                  value={selectedYearlyDate}
                  onChange={e => setSelectedYearlyDate(e.target.value)}
                  style={{ width: '120px' }}
                >
                  {availableYears.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
                <button
                  className="btn btn-xs btn-outline-purple rounded-pill px-2 py-1"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setSelectedYearlyDate(currentYearStr)}
                >
                  Current Year
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Spending Breakdown & Chart Section */}
      <div className="row g-4 mb-4">
        {/* Total Summary Card */}
        <div className="col-12 col-md-5">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="stash-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill fw-bold text-uppercase mb-2">
                {viewMode === 'daily' ? '📅 Daily Spending' : viewMode === 'monthly' ? '🗓️ Monthly Spending' : '📆 Yearly Spending'}
              </span>
              <div className="text-secondary small fw-semibold">
                {viewMode === 'daily' 
                  ? `Expenses on ${formatFullDate(selectedDailyDate)}` 
                  : viewMode === 'monthly' 
                  ? `Expenses in ${formatMonthLabel(selectedMonthlyDate)}` 
                  : `Expenses in Year ${selectedYearlyDate}`}
              </div>
              <div className="brand-font display-5 text-danger fw-bold my-2">
                ₹{viewTotalSpent.toLocaleString('en-IN')}
              </div>
              <small className="text-muted d-block mb-3">
                Overall All-Time Total: <strong>₹{overallTotalSpent.toLocaleString('en-IN')}</strong>
              </small>
            </div>

            <div className="p-3 bg-light rounded-4 border-start border-4 border-purple" style={{ borderLeftColor: '#8B5CF6' }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-shield-check text-purple fs-5"></i>
                <span className="fw-bold small text-dark">Budget Insight</span>
              </div>
              <p className="text-secondary small mb-0">
                {viewMode === 'daily' 
                  ? `Viewing daily history for ${formatFullDate(selectedDailyDate)}` 
                  : viewMode === 'monthly' 
                  ? `Viewing monthly data for ${formatMonthLabel(selectedMonthlyDate)}` 
                  : `Viewing yearly financial summary for ${selectedYearlyDate}`}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Category Breakdown Recharts Pie Chart */}
        <div className="col-12 col-md-7">
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="stash-card p-4 h-100 text-center">
            <h5 className="brand-font mb-3 text-dark text-start">
              {viewMode === 'daily' ? `Category Breakdown (${selectedDailyDate})` : viewMode === 'monthly' ? `Category Breakdown (${selectedMonthlyDate})` : `Category Breakdown (${selectedYearlyDate})`}
            </h5>
            {chartData.length === 0 ? (
              <div className="py-5 text-muted">
                <i className="bi bi-pie-chart fs-1 text-secondary opacity-50 d-block mb-2"></i>
                No expenses logged for this {viewMode} selection.
              </div>
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

      {/* Filtered Expense Logs Table / Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stash-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="brand-font mb-0 text-dark">
              {viewMode === 'daily' 
                ? `📅 Daily Expenses (${selectedDailyDate})` 
                : viewMode === 'monthly' 
                ? `🗓️ Monthly Expenses (${formatMonthLabel(selectedMonthlyDate)})` 
                : `📆 Yearly Expenses (${selectedYearlyDate})`}
            </h5>
            <small className="text-secondary">Selected period transaction list</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button 
              className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-bold me-1"
              onClick={handleDownloadExcel}
            >
              <i className="bi bi-download me-1"></i> Excel (.csv)
            </button>
            <span className="badge bg-purple-subtle text-purple rounded-pill px-3 py-1 fw-bold">
              {filteredExpenses.length} Items
            </span>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-receipt-cutoff fs-1 text-secondary opacity-50 d-block mb-2"></i>
            No expenses found for the selected {viewMode} period ({viewMode === 'daily' ? selectedDailyDate : viewMode === 'monthly' ? selectedMonthlyDate : selectedYearlyDate}).
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            <AnimatePresence>
              {filteredExpenses.map((exp, idx) => (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.04 }}
                  className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-light"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle p-2 d-flex align-items-center justify-content-center text-purple bg-white shadow-sm"
                      style={{ width: '44px', height: '44px', color: '#8B5CF6' }}
                    >
                      <i className={`bi ${exp.icon} fs-5`}></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{exp.title}</div>
                      <div className="text-muted small">
                        <span className="badge bg-secondary-subtle text-dark me-2">{exp.category}</span>
                        📅 {formatFullDate(exp.date)}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="brand-font fw-bold text-danger fs-5">-₹{(parseFloat(exp.amount) || 0).toLocaleString('en-IN')}</span>
                    <button
                      className="btn btn-sm text-secondary hover-danger border-0 p-1"
                      onClick={() => deleteExpense(exp.id)}
                      title="Delete expense"
                    >
                      <i className="bi bi-trash fs-5"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
