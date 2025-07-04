// ERP System JavaScript

// Sample data
const sampleData = {
    inventory: [
        { id: 'IT001', name: 'Laptop Computer', category: 'electronics', stock: 45, price: 1299.99, reorderPoint: 10 },
        { id: 'OF002', name: 'Office Chair', category: 'office', stock: 23, price: 189.99, reorderPoint: 5 },
        { id: 'RM003', name: 'Steel Sheets', category: 'raw-materials', stock: 156, price: 89.50, reorderPoint: 50 },
        { id: 'IT004', name: 'Monitor 24"', category: 'electronics', stock: 8, price: 299.99, reorderPoint: 15 },
        { id: 'OF005', name: 'Printer Paper', category: 'office', stock: 234, price: 12.99, reorderPoint: 100 },
        { id: 'RM006', name: 'Copper Wire', category: 'raw-materials', stock: 67, price: 45.75, reorderPoint: 25 }
    ],
    employees: [
        { id: 'EMP001', name: 'John Smith', department: 'Engineering', position: 'Senior Engineer', hireDate: '2021-03-15', salary: 85000 },
        { id: 'EMP002', name: 'Sarah Johnson', department: 'Sales', position: 'Sales Manager', hireDate: '2020-01-22', salary: 72000 },
        { id: 'EMP003', name: 'Mike Davis', department: 'HR', position: 'HR Specialist', hireDate: '2022-06-10', salary: 58000 },
        { id: 'EMP004', name: 'Emily Chen', department: 'Finance', position: 'Financial Analyst', hireDate: '2021-11-08', salary: 65000 },
        { id: 'EMP005', name: 'David Wilson', department: 'IT', position: 'System Administrator', hireDate: '2019-09-30', salary: 68000 }
    ],
    transactions: [
        { id: 'TXN001', description: 'Office Equipment Purchase', amount: -15420.50, date: '2024-01-15', type: 'expense' },
        { id: 'TXN002', description: 'Customer Payment - ABC Corp', amount: 45000.00, date: '2024-01-14', type: 'income' },
        { id: 'TXN003', description: 'Utility Bills', amount: -2340.75, date: '2024-01-13', type: 'expense' },
        { id: 'TXN004', description: 'Product Sales', amount: 28750.00, date: '2024-01-12', type: 'income' },
        { id: 'TXN005', description: 'Employee Salaries', amount: -156780.00, date: '2024-01-10', type: 'expense' }
    ],
    purchaseOrders: [
        { id: 'PO001', supplier: 'Tech Solutions Ltd', amount: 25400.00, status: 'pending', date: '2024-01-15' },
        { id: 'PO002', supplier: 'Office Supplies Co', amount: 1250.75, status: 'approved', date: '2024-01-14' },
        { id: 'PO003', supplier: 'Industrial Materials', amount: 8900.00, status: 'delivered', date: '2024-01-10' },
        { id: 'PO004', supplier: 'Equipment Rentals', amount: 3400.00, status: 'pending', date: '2024-01-12' }
    ],
    activities: [
        { icon: '📦', title: 'Inventory Updated', time: '2 hours ago', type: 'inventory' },
        { icon: '💰', title: 'Payment Received', time: '4 hours ago', type: 'accounting' },
        { icon: '👥', title: 'New Employee Added', time: '6 hours ago', type: 'hr' },
        { icon: '📋', title: 'Purchase Order Created', time: '1 day ago', type: 'procurement' },
        { icon: '📊', title: 'Monthly Report Generated', time: '2 days ago', type: 'reports' }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    updateLastUpdated();
    loadDashboard();
    loadInventory();
    loadAccounting();
    loadHR();
    loadProcurement();
    setupSearch();
    setupKeyboardShortcuts();
}

// URL Router for SPA functionality
const router = {
    routes: {},
    
    init() {
        // Listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', this.handlePopState.bind(this));
        
        // Handle initial load
        this.handleRoute(window.location.hash || '#dashboard');
    },
    
    addRoute(path, callback) {
        this.routes[path] = callback;
    },
    
    navigate(path) {
        // Update URL without reloading page
        window.history.pushState({}, '', `${window.location.pathname}${path}`);
        this.handleRoute(path);
    },
    
    handlePopState(event) {
        this.handleRoute(window.location.hash || '#dashboard');
    },
    
    handleRoute(path) {
        // Remove # if present
        const cleanPath = path.replace('#', '');
        const route = this.routes[cleanPath] || this.routes['dashboard'];
        if (route) route();
    }
};

// Navigation system with URL routing
function setupNavigation() {
    // Setup routes
    router.addRoute('dashboard', () => switchTab('dashboard'));
    router.addRoute('inventory', () => switchTab('inventory'));
    router.addRoute('accounting', () => switchTab('accounting'));
    router.addRoute('hr', () => switchTab('hr'));
    router.addRoute('procurement', () => switchTab('procurement'));
    router.addRoute('reports', () => switchTab('reports'));
    
    // Initialize router
    router.init();
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.dataset.tab;
            router.navigate(`#${tabName}`);
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all nav items and tab contents
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked nav item and corresponding tab content
    const navItem = document.querySelector(`[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(tabName);
    
    if (navItem && tabContent) {
        navItem.classList.add('active');
        tabContent.classList.add('active');
        
        // Update page title
        document.title = `${navItem.textContent.trim()} - ERP System - Nexus Corp`;
    }
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    document.getElementById('last-updated').textContent = now.toLocaleString();
}

// Dashboard functions
function loadDashboard() {
    loadActivities();
    createRevenueChart();
}

function loadActivities() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    
    sampleData.activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

function createRevenueChart() {
    const canvas = document.getElementById('revenue-chart');
    const ctx = canvas.getContext('2d');
    
    // Simple chart drawing
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Sample revenue data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenue = [450000, 520000, 480000, 610000, 580000, 650000];
    
    // Draw chart
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const maxRevenue = Math.max(...revenue);
    const chartWidth = canvas.width - 80;
    const chartHeight = canvas.height - 80;
    
    revenue.forEach((value, index) => {
        const x = 40 + (index * (chartWidth / (revenue.length - 1)));
        const y = 40 + (chartHeight - (value / maxRevenue) * chartHeight);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#3498db';
    revenue.forEach((value, index) => {
        const x = 40 + (index * (chartWidth / (revenue.length - 1)));
        const y = 40 + (chartHeight - (value / maxRevenue) * chartHeight);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Inventory functions
function loadInventory() {
    const tbody = document.getElementById('inventory-tbody');
    tbody.innerHTML = '';
    
    sampleData.inventory.forEach(item => {
        const row = document.createElement('tr');
        const stockLevel = getStockLevel(item.stock, item.reorderPoint);
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td><span class="stock-level ${stockLevel.class}">${item.stock} units</span></td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.stock * item.price).toFixed(2)}</td>
            <td>
                <button class="action-btn" onclick="editItem('${item.id}')">Edit</button>
                <button class="action-btn danger" onclick="deleteItem('${item.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getStockLevel(stock, reorderPoint) {
    if (stock <= reorderPoint) {
        return { class: 'low', text: 'Low' };
    } else if (stock <= reorderPoint * 2) {
        return { class: 'medium', text: 'Medium' };
    } else {
        return { class: 'high', text: 'High' };
    }
}

// Accounting functions
function loadAccounting() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';
    
    sampleData.transactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        transactionItem.innerHTML = `
            <div class="transaction-details">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-date">${transaction.date}</div>
            </div>
            <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
            </div>
        `;
        transactionList.appendChild(transactionItem);
    });
}

// HR functions
function loadHR() {
    const tbody = document.getElementById('employee-tbody');
    tbody.innerHTML = '';
    
    sampleData.employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>${employee.hireDate}</td>
            <td>$${employee.salary.toLocaleString()}</td>
            <td>
                <button class="action-btn" onclick="editEmployee('${employee.id}')">Edit</button>
                <button class="action-btn danger" onclick="deleteEmployee('${employee.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Procurement functions
function loadProcurement() {
    const purchaseOrderList = document.getElementById('purchase-order-list');
    purchaseOrderList.innerHTML = '';
    
    sampleData.purchaseOrders.forEach(po => {
        const poItem = document.createElement('div');
        poItem.className = 'purchase-order-item';
        poItem.innerHTML = `
            <div class="po-details">
                <div class="po-number">${po.id}</div>
                <div class="po-supplier">${po.supplier}</div>
            </div>
            <div style="text-align: right;">
                <div class="po-amount">$${po.amount.toFixed(2)}</div>
                <span class="po-status ${po.status}">${po.status.charAt(0).toUpperCase() + po.status.slice(1)}</span>
            </div>
        `;
        purchaseOrderList.appendChild(poItem);
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('inventory-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterInventory);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterInventory);
    }
}

function filterInventory() {
    const searchTerm = document.getElementById('inventory-search').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value;
    
    const filteredInventory = sampleData.inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                            item.id.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    
    displayFilteredInventory(filteredInventory);
}

function displayFilteredInventory(inventory) {
    const tbody = document.getElementById('inventory-tbody');
    tbody.innerHTML = '';
    
    inventory.forEach(item => {
        const row = document.createElement('tr');
        const stockLevel = getStockLevel(item.stock, item.reorderPoint);
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td><span class="stock-level ${stockLevel.class}">${item.stock} units</span></td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.stock * item.price).toFixed(2)}</td>
            <td>
                <button class="action-btn" onclick="editItem('${item.id}')">Edit</button>
                <button class="action-btn danger" onclick="deleteItem('${item.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Modal functions (placeholder implementations)
function openAddItemModal() {
    alert('Add Item modal would open here');
}

function openTransactionModal() {
    alert('Transaction modal would open here');
}

function openEmployeeModal() {
    alert('Employee modal would open here');
}

function openPurchaseOrderModal() {
    alert('Purchase Order modal would open here');
}

function editItem(id) {
    alert(`Edit item ${id} modal would open here`);
}

function deleteItem(id) {
    if (confirm(`Are you sure you want to delete item ${id}?`)) {
        alert(`Item ${id} deleted`);
        // Remove from data and reload
        const index = sampleData.inventory.findIndex(item => item.id === id);
        if (index > -1) {
            sampleData.inventory.splice(index, 1);
            loadInventory();
        }
    }
}

function editEmployee(id) {
    alert(`Edit employee ${id} modal would open here`);
}

function deleteEmployee(id) {
    if (confirm(`Are you sure you want to delete employee ${id}?`)) {
        alert(`Employee ${id} deleted`);
        // Remove from data and reload
        const index = sampleData.employees.findIndex(emp => emp.id === id);
        if (index > -1) {
            sampleData.employees.splice(index, 1);
            loadHR();
        }
    }
}

function generateReport() {
    alert('Report generation would start here');
}

function selectReport(type) {
    alert(`${type} report selected`);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Alt + number keys for tab navigation
        if (e.altKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const tabs = ['dashboard', 'inventory', 'accounting', 'hr', 'procurement', 'reports'];
            const tabIndex = parseInt(e.key) - 1;
            if (tabs[tabIndex]) {
                router.navigate(`#${tabs[tabIndex]}`);
            }
        }
        
        // Ctrl/Cmd + N for new record (context dependent)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const activeTab = document.querySelector('.tab-content.active').id;
            switch (activeTab) {
                case 'inventory':
                    openAddItemModal();
                    break;
                case 'accounting':
                    openTransactionModal();
                    break;
                case 'hr':
                    openEmployeeModal();
                    break;
                case 'procurement':
                    openPurchaseOrderModal();
                    break;
            }
        }
    });
}

// Auto-refresh dashboard every 30 seconds
setInterval(() => {
    updateLastUpdated();
    loadActivities();
}, 30000);