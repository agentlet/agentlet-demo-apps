// Sample expense data based on the sample PDF receipts in mock/
const sampleExpenses = {
    pending: [
        {
            id: 1,
            employee: "Jonas Weber",
            amount: 2254.00,
            currency: "USD",
            category: "Travel",
            description: "Hotel accommodation - The Palazzo Las Vegas (7-night stay)",
            date: "2026-09-14",
            submittedDate: "2026-09-28",
            receipt: "example2.pdf",
            status: "pending",
            priority: "high",
            notes: "Business trip accommodation with room upgrades and resort fees. Reservation #436056301543"
        },
        {
            id: 2,
            employee: "Jonas Weber",
            amount: 86.75,
            currency: "EUR",
            category: "Travel",
            description: "ICE train ticket Hamburg to Bonn (first class)",
            date: "2026-09-22",
            submittedDate: "2026-09-29",
            receipt: "example1.pdf",
            status: "pending",
            priority: "medium",
            notes: "Deutsche Bahn ticket with seat reservation. Order number: EN97RX"
        },
        {
            id: 3,
            employee: "Elena Petrova",
            amount: 26.45,
            currency: "PLN", 
            category: "Meals",
            description: "Coffee and beverages - Finest Coffee, Wrocław",
            date: "2026-09-24",
            submittedDate: "2026-09-26",
            receipt: "example3.pdf",
            status: "pending",
            priority: "low",
            notes: "Business meeting refreshments at Pl. Grunwaldzki 15-27, Wrocław, Poland"
        },
        {
            id: 4,
            employee: "Jonas Weber",
            amount: 43.90,
            currency: "EUR",
            category: "Transportation",
            description: "Diesel fuel purchase - 34.87 liters",
            date: "2026-09-19",
            submittedDate: "2026-09-30",
            receipt: "example4.pdf",
            status: "pending",
            priority: "low",
            notes: "Star Tankstelle, Leipzig. Business travel fuel expense"
        }
    ],
    approved: [
        {
            id: 101,
            employee: "Kwame Mensah",
            amount: 1245.00,
            currency: "USD",
            category: "Travel",
            description: "Business trip to Chicago - Client meetings",
            date: "2026-09-08",
            approvedDate: "2026-09-10",
            receipt: "example1.pdf",
            status: "approved",
            approvedBy: "Ingrid Solheim",
            comments: "All documentation complete. Valid business purpose."
        },
        {
            id: 102,
            employee: "Sofia Marchetti",
            amount: 45.50,
            currency: "USD",
            category: "Office supplies",
            description: "Printer ink and paper supplies",
            date: "2026-09-05",
            approvedDate: "2026-09-06",
            receipt: "example4.pdf",
            status: "approved",
            approvedBy: "Ingrid Solheim",
            comments: "Standard office supplies - approved."
        }
    ],
    rejected: [
        {
            id: 201,
            employee: "Rajesh Iyer",
            amount: 89.50,
            currency: "USD",
            category: "Meals",
            description: "Business dinner",
            date: "2026-09-09",
            rejectedDate: "2026-09-11",
            receipt: "example3.pdf",
            status: "rejected",
            rejectedBy: "Ingrid Solheim",
            comments: "Exceeds daily meal allowance limit of $75. Please resubmit with valid amount."
        }
    ]
};

const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'PLN': 'zł'
};

// Format an amount with two decimals and a thousands separator, e.g. 2,404.33
function formatAmount(amount) {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Format an amount with the symbol of its currency (defaults to USD)
function formatCurrencyAmount(amount, currency) {
    const symbol = currencySymbols[currency || 'USD'] || '$';
    return `${symbol}${formatAmount(amount)}`;
}

// Format an ISO date (2026-09-12) as "Sep 12, 2026" without timezone shifts
function formatDate(isoDate) {
    const parts = String(isoDate || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return isoDate || '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parts[1] - 1]} ${parts[2]}, ${parts[0]}`;
}

// Current expense being reviewed
let currentExpense = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadExpenses();
    setupEventListeners();
    
    // Set default tab
    showTab('dashboard');
});

function initializeApp() {
    console.log('Expenses application initialized');
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });

    // Modal close events
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            currentExpense = null;
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.altKey) {
            switch(event.key) {
                case '1':
                    event.preventDefault();
                    showTab('dashboard');
                    break;
                case '2':
                    event.preventDefault();
                    showTab('pending');
                    break;
                case '3':
                    event.preventDefault();
                    showTab('approved');
                    break;
                case '4':
                    event.preventDefault();
                    showTab('rejected');
                    break;
                case '5':
                    event.preventDefault();
                    showTab('reports');
                    break;
            }
        }
        
        // Close modal with Escape key
        if (event.key === 'Escape') {
            const modal = document.querySelector('.modal[style*="block"]');
            if (modal) {
                modal.style.display = 'none';
                currentExpense = null;
            }
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterExpenses();
        });
    }

    // Filter functionality
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', function() {
            filterExpenses();
        });
    });
}

function showTab(tabName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
            document.title = `${tab.textContent.trim()} | Expenses | Westbrook Industries`;
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // Load content for specific tabs
    if (tabName === 'pending' || tabName === 'approved' || tabName === 'rejected') {
        loadExpensesList(tabName);
    }
}

function loadExpenses() {
    // This would typically fetch from server
    console.log('Loading expenses data...');
    updateDashboardStats();
}

function updateDashboardStats() {
    const pendingCount = sampleExpenses.pending.length;
    // Convert all amounts to USD for display (simplified conversion)
    // Work in cents so the displayed total never carries floating point noise
    const pendingCents = sampleExpenses.pending.reduce((sum, expense) => {
        let amount = expense.amount;
        // Simple currency conversion for display
        if (expense.currency === 'EUR') amount *= 1.1;
        if (expense.currency === 'PLN') amount *= 0.25;
        return sum + Math.round(amount * 100);
    }, 0);
    const pendingAmount = pendingCents / 100;
    const approvedThisMonth = sampleExpenses.approved.length;
    
    // Update stat cards
    document.querySelector('.stats-grid .stat-card:nth-child(1) .stat-value').textContent = pendingCount;
    document.querySelector('.stats-grid .stat-card:nth-child(2) .stat-value').textContent = `$${formatAmount(pendingAmount)}`;
    document.querySelector('.stats-grid .stat-card:nth-child(3) .stat-value').textContent = approvedThisMonth;
}

function loadExpensesList(status) {
    const container = document.getElementById(`${status}-expenses`);
    const expenses = sampleExpenses[status] || [];
    
    container.innerHTML = '';
    
    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No ${status} expenses found.</p>
            </div>
        `;
        return;
    }
    
    expenses.forEach(expense => {
        const expenseCard = createExpenseCard(expense, status);
        container.appendChild(expenseCard);
    });
}

function createExpenseCard(expense, status) {
    const card = document.createElement('div');
    card.className = `expense-card ${status}`;
    
    const statusBadge = status === 'pending' ? 
        `<span class="expense-status ${status} badge tone-warning">Pending</span>` :
        status === 'approved' ?
        `<span class="expense-status ${status} badge tone-success">Approved</span>` :
        `<span class="expense-status ${status} badge tone-danger">Rejected</span>`;
    
    const actions = status === 'pending' ? 
        `<div class="expense-actions">
            <button class="btn-primary" onclick="reviewExpense(${expense.id})">Review</button>
        </div>` : '';
    
    const dateInfo = status === 'approved' ? 
        `${expense.category}, approved ${formatDate(expense.approvedDate)}` :
        status === 'rejected' ?
        `${expense.category}, rejected ${formatDate(expense.rejectedDate)}` :
        `${expense.category}, submitted ${formatDate(expense.submittedDate)}`;
    
    const formattedAmount = formatCurrencyAmount(expense.amount, expense.currency);
    
    card.innerHTML = `
        <div class="expense-info">
            <div class="expense-employee">${expense.employee}</div>
            <div class="expense-details">
                <div class="expense-description">${expense.description}</div>
                <div class="expense-meta">${dateInfo}</div>
            </div>
            <div class="expense-amount num">${formattedAmount}</div>
            ${statusBadge}
        </div>
        ${actions}
    `;
    
    return card;
}

function reviewExpense(expenseId) {
    const expense = sampleExpenses.pending.find(e => e.id === expenseId);
    if (!expense) return;
    
    currentExpense = expense;
    
    // Populate modal with expense details
    document.getElementById('modal-employee').textContent = expense.employee;
    
    document.getElementById('modal-amount').textContent = formatCurrencyAmount(expense.amount, expense.currency);
    
    document.getElementById('modal-category').textContent = expense.category;
    document.getElementById('modal-date').textContent = formatDate(expense.date);
    document.getElementById('modal-description').textContent = expense.description;
    
    // Setup download receipt button
    const downloadBtn = document.getElementById('download-receipt');
    downloadBtn.onclick = () => downloadReceipt(expense.receipt);
    
    // Clear previous form data
    document.getElementById('approval-comments').value = '';
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Show modal
    document.getElementById('expense-modal').style.display = 'block';
}

function downloadReceipt(filename) {
    // Download actual PDF file from mock folder
    const link = document.createElement('a');
    link.href = `mock/${filename}`;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show notification
    showNotification(`Downloaded receipt: ${filename}`, 'info');
}

function approveExpense() {
    if (!currentExpense) return;
    
    const comments = document.getElementById('approval-comments').value;
    
    // Validate checklist items
    const checkedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    if (checkedItems < 4) {
        alert('Please complete all validation checklist items before approving.');
        return;
    }
    
    // Move expense to approved list
    const approvedExpense = {
        ...currentExpense,
        status: 'approved',
        approvedDate: new Date().toISOString().split('T')[0],
        approvedBy: 'Ingrid Solheim',
        comments: comments || 'Approved after validation review.'
    };
    
    sampleExpenses.approved.unshift(approvedExpense);
    sampleExpenses.pending = sampleExpenses.pending.filter(e => e.id !== currentExpense.id);
    
    // Close modal and refresh
    closeModal('expense-modal');
    updateDashboardStats();
    loadExpensesList('pending');
    
    // Show success message
    showNotification('Expense approved successfully!', 'success');
}

function rejectExpense() {
    if (!currentExpense) return;
    
    const comments = document.getElementById('approval-comments').value.trim();
    if (!comments) {
        alert('Comments are required when rejecting an expense.');
        return;
    }
    
    // Move expense to rejected list
    const rejectedExpense = {
        ...currentExpense,
        status: 'rejected',
        rejectedDate: new Date().toISOString().split('T')[0],
        rejectedBy: 'Ingrid Solheim',
        comments: comments
    };
    
    sampleExpenses.rejected.unshift(rejectedExpense);
    sampleExpenses.pending = sampleExpenses.pending.filter(e => e.id !== currentExpense.id);
    
    // Close modal and refresh
    closeModal('expense-modal');
    updateDashboardStats();
    loadExpensesList('pending');
    
    // Show success message
    showNotification('Expense rejected.', 'error');
}

function requestMoreInfo() {
    if (!currentExpense) return;
    
    const comments = document.getElementById('approval-comments').value.trim();
    if (!comments) {
        alert('Please specify what additional information is needed.');
        return;
    }
    
    // In a real application, this would send a notification to the employee
    alert(`Request for more information sent to ${currentExpense.employee}:\n\n${comments}`);
    
    closeModal('expense-modal');
    showNotification('Request for additional information sent.', 'info');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    currentExpense = null;
}

function filterExpenses() {
    // This would implement filtering logic for the current tab
    console.log('Filtering expenses...');
}

function showNotification(message, type) {
    // Simple notification system, styled by .notification in styles.css
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
