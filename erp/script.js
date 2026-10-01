// ERP JavaScript

// Sample data
const sampleData = {
    inventory: [
        { id: 'IT001', name: 'Business laptop 14"', category: 'electronics', stock: 45, price: 1299.99, reorderPoint: 10 },
        { id: 'OF002', name: 'Ergonomic office chair', category: 'office', stock: 23, price: 189.99, reorderPoint: 5 },
        { id: 'RM003', name: 'Cold-rolled steel sheet, 2 mm', category: 'raw-materials', stock: 156, price: 89.50, reorderPoint: 50 },
        { id: 'IT004', name: 'Monitor 24"', category: 'electronics', stock: 8, price: 299.99, reorderPoint: 15 },
        { id: 'OF005', name: 'Copy paper A4, 80 gsm', category: 'office', stock: 234, price: 12.99, reorderPoint: 100 },
        { id: 'RM006', name: 'Copper wire, 1.5 mm2', category: 'raw-materials', stock: 67, price: 45.75, reorderPoint: 25 }
    ],
    employees: [
        { id: 'EMP001', name: 'Kwame Mensah', department: 'Engineering', position: 'Senior engineer', hireDate: '2021-03-15', salary: 85000 },
        { id: 'EMP002', name: 'Sofia Marchetti', department: 'Sales', position: 'Sales manager', hireDate: '2020-01-22', salary: 72000 },
        { id: 'EMP003', name: 'Hannah Kowalski', department: 'HR', position: 'HR specialist', hireDate: '2022-06-10', salary: 58000 },
        { id: 'EMP004', name: 'Rajesh Iyer', department: 'Finance', position: 'Financial analyst', hireDate: '2021-11-08', salary: 65000 },
        { id: 'EMP005', name: 'Yuki Tanaka', department: 'IT', position: 'System administrator', hireDate: '2019-09-30', salary: 68000 }
    ],
    transactions: [
        { id: 'TXN001', description: 'Office equipment purchase', amount: -15420.50, date: '2026-09-15', type: 'expense' },
        { id: 'TXN002', description: 'Customer payment: Halvorsen Packaging', amount: 45000.00, date: '2026-09-14', type: 'income' },
        { id: 'TXN003', description: 'Utility bills', amount: -2340.75, date: '2026-09-13', type: 'expense' },
        { id: 'TXN004', description: 'Product sales', amount: 28750.00, date: '2026-09-12', type: 'income' },
        { id: 'TXN005', description: 'Employee salaries, September', amount: -156780.00, date: '2026-09-10', type: 'expense' }
    ],
    purchaseOrders: [
        { id: 'PO001', supplier: 'Brightline Systems Ltd', amount: 25400.00, status: 'pending', date: '2026-09-15' },
        { id: 'PO002', supplier: 'Marlowe Office Supply', amount: 1250.75, status: 'approved', date: '2026-09-14' },
        { id: 'PO003', supplier: 'Kestrel Industrial Materials', amount: 8900.00, status: 'delivered', date: '2026-09-10' },
        { id: 'PO004', supplier: 'Ridgeway Equipment Rental', amount: 3400.00, status: 'pending', date: '2026-09-12' }
    ],
    activities: [
        { icon: '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>', title: 'Inventory updated', time: '2 hours ago', type: 'inventory' },
        { icon: '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>', title: 'Payment received', time: '4 hours ago', type: 'accounting' },
        { icon: '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>', title: 'New employee added', time: '6 hours ago', type: 'hr' },
        { icon: '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>', title: 'Purchase order created', time: '1 day ago', type: 'procurement' },
        { icon: '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>', title: 'Monthly report generated', time: '2 days ago', type: 'reports' }
    ]
};

const categoryLabels = {
    'electronics': 'Electronics',
    'office': 'Office supplies',
    'raw-materials': 'Raw materials'
};

const poStatusTones = {
    pending: 'tone-warning',
    approved: 'tone-info',
    delivered: 'tone-success'
};

const stockTones = {
    low: 'tone-danger',
    medium: 'tone-warning',
    high: 'tone-success'
};

// Formatting helpers
function formatMoney(value) {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function cssToken(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

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
    window.addEventListener('resize', createRevenueChart);
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
        
        // Redraw the chart when the dashboard becomes visible
        if (tabName === 'dashboard' && typeof createRevenueChart === 'function') createRevenueChart();

        // Update page title
        document.title = `${navItem.textContent.trim()} | ERP | Westbrook Industries`;
    }
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    document.getElementById('last-updated').textContent = now.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
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

    // Size the canvas for the current layout and screen density
    const width = canvas.offsetWidth;
    if (!width) return;
    const height = 300;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.height = height + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Sample revenue data
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const revenue = [450000, 520000, 480000, 610000, 580000, 650000];

    const gridColor = cssToken('--chart-grid');
    const lineColor = cssToken('--chart-1');
    const textColor = cssToken('--text-muted');
    ctx.font = '12px ' + getComputedStyle(document.body).fontFamily;

    const left = 56;
    const right = 16;
    const top = 16;
    const bottom = 32;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;
    const axisMax = 700000;
    const ticks = 7;

    // Gridlines and value labels
    ctx.lineWidth = 1;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= ticks; i++) {
        const y = Math.round(top + chartHeight - (i / ticks) * chartHeight) + 0.5;
        ctx.strokeStyle = gridColor;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(left + chartWidth, y);
        ctx.stroke();
        ctx.fillText('$' + Math.round((axisMax / ticks) * i / 1000) + 'K', left - 8, y);
    }

    // Month labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const pointX = index => left + 24 + index * ((chartWidth - 48) / (revenue.length - 1));
    const pointY = value => top + chartHeight - (value / axisMax) * chartHeight;
    months.forEach((month, index) => ctx.fillText(month, pointX(index), top + chartHeight + 10));

    // Line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    revenue.forEach((value, index) => {
        if (index === 0) {
            ctx.moveTo(pointX(index), pointY(value));
        } else {
            ctx.lineTo(pointX(index), pointY(value));
        }
    });
    ctx.stroke();

    // Points
    ctx.fillStyle = lineColor;
    revenue.forEach((value, index) => {
        ctx.beginPath();
        ctx.arc(pointX(index), pointY(value), 3, 0, 2 * Math.PI);
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
            <td>${categoryLabels[item.category] || item.category}</td>
            <td><span class="stock-level ${stockLevel.class} ${stockTones[stockLevel.class]}">${item.stock} units</span></td>
            <td class="num">${formatMoney(item.price)}</td>
            <td class="num">${formatMoney(item.stock * item.price)}</td>
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
                <div class="transaction-date">${formatDate(transaction.date)}</div>
            </div>
            <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                ${transaction.amount > 0 ? '+' : '-'}${formatMoney(Math.abs(transaction.amount))}
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
            <td>${formatDate(employee.hireDate)}</td>
            <td class="num">$${employee.salary.toLocaleString('en-US')}</td>
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
            <div class="po-summary">
                <div class="po-amount">${formatMoney(po.amount)}</div>
                <span class="po-status ${po.status} badge ${poStatusTones[po.status]}">${po.status.charAt(0).toUpperCase() + po.status.slice(1)}</span>
                <div class="po-date">${formatDate(po.date)}</div>
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
            <td>${categoryLabels[item.category] || item.category}</td>
            <td><span class="stock-level ${stockLevel.class} ${stockTones[stockLevel.class]}">${item.stock} units</span></td>
            <td class="num">${formatMoney(item.price)}</td>
            <td class="num">${formatMoney(item.stock * item.price)}</td>
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
    alert('Add item modal would open here');
}

function openTransactionModal() {
    alert('Transaction modal would open here');
}

function openEmployeeModal() {
    alert('Employee modal would open here');
}

function openPurchaseOrderModal() {
    alert('Purchase order modal would open here');
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