// Sample expense data based on actual PDF receipts
const sampleExpenses = {
    pending: [
        {
            id: 1,
            employee: "Jens W.",
            amount: 2254.00,
            currency: "USD",
            category: "Travel",
            description: "Hotel accommodation - The Palazzo Las Vegas (7-night stay)",
            date: "2019-12-01",
            submittedDate: "2024-01-12",
            receipt: "example2.pdf",
            status: "pending",
            priority: "high",
            notes: "Business trip accommodation with room upgrades and resort fees. Reservation #436056301543"
        },
        {
            id: 2,
            employee: "Jens W.", 
            amount: 86.75,
            currency: "EUR",
            category: "Travel",
            description: "ICE train ticket Hamburg to Bonn (first class)",
            date: "2017-11-24",
            submittedDate: "2024-01-13",
            receipt: "example1.pdf",
            status: "pending",
            priority: "medium",
            notes: "Deutsche Bahn ticket with seat reservation. Order number: EN97RX"
        },
        {
            id: 3,
            employee: "Jens W.",
            amount: 26.45,
            currency: "PLN", 
            category: "Meals",
            description: "Coffee and beverages - Finest Coffee, Wrocław",
            date: "2020-02-25",
            submittedDate: "2024-01-11",
            receipt: "example3.pdf",
            status: "pending",
            priority: "low",
            notes: "Business meeting refreshments at Pl. Grunwaldzki 15-27, Wrocław, Poland"
        },
        {
            id: 4,
            employee: "Jens W.",
            amount: 43.90,
            currency: "EUR",
            category: "Transportation",
            description: "Diesel fuel purchase - 34.87 liters",
            date: "2021-03-19",
            submittedDate: "2024-01-14",
            receipt: "example4.pdf",
            status: "pending",
            priority: "low",
            notes: "Star Tankstelle, Leipzig. Business travel fuel expense"
        }
    ],
    approved: [
        {
            id: 101,
            employee: "John Smith",
            amount: 1245.00,
            currency: "USD",
            category: "Travel",
            description: "Business trip to Chicago - Client meetings",
            date: "2024-01-08",
            approvedDate: "2024-01-10",
            receipt: "travel_expenses.pdf",
            status: "approved",
            approvedBy: "Sarah Johnson",
            comments: "All documentation complete. Valid business purpose."
        },
        {
            id: 102,
            employee: "Karen Brown", 
            amount: 45.50,
            currency: "USD",
            category: "Office Supplies",
            description: "Printer ink and paper supplies",
            date: "2024-01-05",
            approvedDate: "2024-01-06",
            receipt: "staples_receipt.pdf",
            status: "approved",
            approvedBy: "Sarah Johnson",
            comments: "Standard office supplies - approved."
        }
    ],
    rejected: [
        {
            id: 201,
            employee: "Mike Davis",
            amount: 89.50,
            currency: "USD",
            category: "Meals",
            description: "Business dinner",
            date: "2024-01-09",
            rejectedDate: "2024-01-11",
            receipt: "restaurant_receipt_2.pdf",
            status: "rejected",
            rejectedBy: "Sarah Johnson",
            comments: "Exceeds daily meal allowance limit of $75. Please resubmit with valid amount."
        }
    ]
};

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
    console.log('Nexus Expenses Application Initialized');
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
    const pendingAmount = sampleExpenses.pending.reduce((sum, expense) => {
        let amount = expense.amount;
        // Simple currency conversion for display
        if (expense.currency === 'EUR') amount *= 1.1;
        if (expense.currency === 'PLN') amount *= 0.25;
        return sum + amount;
    }, 0);
    const approvedThisMonth = sampleExpenses.approved.length;
    
    // Update stat cards
    document.querySelector('.stats-grid .stat-card:nth-child(1) .stat-value').textContent = pendingCount;
    document.querySelector('.stats-grid .stat-card:nth-child(2) .stat-value').textContent = `$${pendingAmount.toLocaleString()}`;
    document.querySelector('.stats-grid .stat-card:nth-child(3) .stat-value').textContent = approvedThisMonth;
}

function loadExpensesList(status) {
    const container = document.getElementById(`${status}-expenses`);
    const expenses = sampleExpenses[status] || [];
    
    container.innerHTML = '';
    
    if (expenses.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #7f8c8d;">
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
        `<span class="expense-status ${status}">Pending</span>` :
        status === 'approved' ?
        `<span class="expense-status ${status}">Approved</span>` :
        `<span class="expense-status ${status}">Rejected</span>`;
    
    const actions = status === 'pending' ? 
        `<div class="expense-actions">
            <button class="btn-primary" onclick="reviewExpense(${expense.id})">Review</button>
        </div>` : '';
    
    const dateInfo = status === 'approved' ? 
        `${expense.category} • Approved ${expense.approvedDate}` :
        status === 'rejected' ?
        `${expense.category} • Rejected ${expense.rejectedDate}` :
        `${expense.category} • Submitted ${expense.submittedDate}`;
    
    // Format amount with correct currency
    const currencySymbols = {
        'USD': '$',
        'EUR': '€',
        'PLN': 'zł'
    };
    const currency = expense.currency || 'USD';
    const symbol = currencySymbols[currency] || '$';
    const formattedAmount = `${symbol}${expense.amount.toLocaleString()}`;
    
    card.innerHTML = `
        <div class="expense-info">
            <div class="expense-employee">${expense.employee}</div>
            <div class="expense-details">
                <div class="expense-description">${expense.description}</div>
                <div class="expense-meta">${dateInfo}</div>
            </div>
            <div class="expense-amount">${formattedAmount}</div>
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
    
    // Format amount with correct currency
    const currencySymbols = {
        'USD': '$',
        'EUR': '€', 
        'PLN': 'zł'
    };
    const currency = expense.currency || 'USD';
    const symbol = currencySymbols[currency] || '$';
    document.getElementById('modal-amount').textContent = `${symbol}${expense.amount.toLocaleString()}`;
    
    document.getElementById('modal-category').textContent = expense.category;
    document.getElementById('modal-date').textContent = expense.date;
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
        approvedBy: 'Sarah Johnson',
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
        rejectedBy: 'Sarah Johnson',
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
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        case 'info':
            notification.style.background = '#3498db';
            break;
        default:
            notification.style.background = '#7f8c8d';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);