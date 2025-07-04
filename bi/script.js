// Business Intelligence Dashboard JavaScript

// Global variables for charts
let charts = {};

// Chart creation helper to ensure consistent sizing
function createChartSafely(canvasId, config) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    // Check if container is visible
    const container = ctx.closest('.tab-content');
    if (!container || !container.classList.contains('active')) return null;
    
    // Destroy existing chart if it exists
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    // Set explicit canvas size to prevent infinite growth
    ctx.style.width = '100%';
    ctx.style.height = ctx.closest('.ops-card') ? '150px' : '300px';
    ctx.width = ctx.offsetWidth;
    ctx.height = ctx.offsetHeight;
    
    // Ensure responsive is false and set explicit dimensions
    if (!config.options) config.options = {};
    config.options.responsive = false;
    config.options.maintainAspectRatio = false;
    
    try {
        charts[canvasId] = new Chart(ctx, config);
        return charts[canvasId];
    } catch (e) {
        console.error('Failed to create chart:', canvasId, e);
        return null;
    }
}

// Sample data for BI dashboard
const biData = {
    overview: {
        kpis: {
            totalRevenue: 2800000,
            orders: 1247,
            activeCustomers: 18924,
            conversionRate: 67
        },
        revenueData: {
            daily: [45000, 52000, 48000, 61000, 58000, 65000, 72000],
            weekly: [315000, 364000, 336000, 427000, 406000, 455000, 504000],
            monthly: [1350000, 1560000, 1440000, 1830000, 1740000, 1950000, 2160000]
        },
        categories: {
            labels: ['Electronics', 'Software', 'Services', 'Consulting', 'Hardware'],
            data: [850000, 650000, 480000, 520000, 300000]
        }
    },
    sales: {
        performance: 847320,
        dealSize: 12450,
        salesCycle: 45,
        pipeline: {
            labels: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed'],
            data: [145, 89, 67, 45, 23]
        },
        topPerformers: [
            { name: 'Sarah Johnson', role: 'Senior Sales Rep', sales: 124500 },
            { name: 'Mike Chen', role: 'Account Manager', sales: 108900 },
            { name: 'Emma Davis', role: 'Sales Rep', sales: 95600 },
            { name: 'Alex Wilson', role: 'Senior Account Manager', sales: 87300 },
            { name: 'Lisa Brown', role: 'Sales Rep', sales: 78200 }
        ]
    },
    operations: {
        inventory: 87,
        efficiency: 94.2,
        fulfillment: 2.3,
        quality: 99.1
    },
    customers: {
        total: 18924,
        averageValue: 2340,
        retentionRate: 72,
        satisfactionScore: 4.6,
        segmentation: {
            labels: ['New', 'Returning', 'VIP', 'Inactive'],
            data: [4234, 8956, 2847, 2887]
        }
    },
    financial: {
        revenue: 2845320,
        expenses: 1847920,
        netIncome: 997400,
        profitMargin: 35.1,
        monthlyData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            revenue: [220000, 245000, 268000, 289000, 312000, 298000, 325000, 341000, 356000, 378000, 392000, 421000],
            expenses: [142000, 158000, 173000, 187000, 201000, 192000, 209000, 219000, 229000, 243000, 252000, 271000]
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupFilters();
    setupChartControls();
    setupKeyboardShortcuts();
    // Don't load all tabs initially - let the router handle loading the active tab
}

// URL Router for SPA functionality
const router = {
    routes: {},
    
    init() {
        // Listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', this.handlePopState.bind(this));
        
        // Handle initial load
        this.handleRoute(window.location.hash || '#overview');
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
        this.handleRoute(window.location.hash || '#overview');
    },
    
    handleRoute(path) {
        // Remove # if present
        const cleanPath = path.replace('#', '');
        const route = this.routes[cleanPath] || this.routes['overview'];
        if (route) route();
    }
};

// Navigation system with URL routing
function setupNavigation() {
    // Setup routes
    router.addRoute('overview', () => switchTab('overview'));
    router.addRoute('sales', () => switchTab('sales'));
    router.addRoute('operations', () => switchTab('operations'));
    router.addRoute('customers', () => switchTab('customers'));
    router.addRoute('financial', () => switchTab('financial'));
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
        document.title = `${navItem.textContent.trim()} - Business Intelligence - Nexus Corp`;
    }
    
    // Load tab-specific content
    loadTabContent(tabName);
}

function loadTabContent(tabName) {
    // Add a small delay to ensure the tab is fully visible before creating charts
    setTimeout(() => {
        switch(tabName) {
            case 'overview':
                loadOverview();
                break;
            case 'sales':
                loadSales();
                break;
            case 'operations':
                loadOperations();
                break;
            case 'customers':
                loadCustomers();
                break;
            case 'financial':
                loadFinancial();
                break;
        }
    }, 100);
}

// Chart controls
function setupChartControls() {
    const chartButtons = document.querySelectorAll('.chart-btn');
    chartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const period = this.dataset.period;
            const container = this.closest('.chart-card');
            const buttons = container.querySelectorAll('.chart-btn');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            updateChart(container, period);
        });
    });
}

function updateChart(container, period) {
    const chartId = container.querySelector('canvas').id;
    if (chartId === 'revenue-chart') {
        updateRevenueChart(period);
    }
}

// Overview tab
function loadOverview() {
    createRevenueChart();
    createCategoryChart();
    createAcquisitionChart();
    createPerformanceChart();
}

function createRevenueChart() {
    charts.revenue = createChartSafely('revenue-chart', {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Daily Revenue',
                data: biData.overview.revenueData.daily,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value/1000) + 'K';
                        }
                    }
                }
            }
        }
    });
}

function updateRevenueChart(period) {
    if (!charts.revenue) return;
    
    let data, labels;
    switch(period) {
        case 'daily':
            data = biData.overview.revenueData.daily;
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            break;
        case 'weekly':
            data = biData.overview.revenueData.weekly;
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
            break;
        case 'monthly':
            data = biData.overview.revenueData.monthly;
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
            break;
    }
    
    charts.revenue.data.labels = labels;
    charts.revenue.data.datasets[0].data = data;
    charts.revenue.update();
}

function createCategoryChart() {
    const ctx = document.getElementById('category-chart');
    if (!ctx) return;
    
    if (charts.category) {
        charts.category.destroy();
    }
    
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: biData.overview.categories.labels,
            datasets: [{
                data: biData.overview.categories.data,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c',
                    '#4facfe'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createAcquisitionChart() {
    const ctx = document.getElementById('acquisition-chart');
    if (!ctx) return;
    
    if (charts.acquisition) {
        charts.acquisition.destroy();
    }
    
    charts.acquisition = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Customers',
                data: [234, 189, 267, 298, 245, 287],
                backgroundColor: '#667eea',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;
    
    if (charts.performance) {
        charts.performance.destroy();
    }
    
    charts.performance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Sales', 'Marketing', 'Support', 'Product', 'Finance'],
            datasets: [{
                label: 'Performance Score',
                data: [85, 92, 78, 88, 95],
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Sales tab
function loadSales() {
    createPipelineChart();
    loadTopPerformers();
}

function createPipelineChart() {
    const ctx = document.getElementById('pipeline-chart');
    if (!ctx) return;
    
    if (charts.pipeline) {
        charts.pipeline.destroy();
    }
    
    charts.pipeline = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: biData.sales.pipeline.labels,
            datasets: [{
                label: 'Opportunities',
                data: biData.sales.pipeline.data,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c',
                    '#4facfe'
                ],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function loadTopPerformers() {
    const performersList = document.getElementById('top-performers');
    if (!performersList) return;
    
    performersList.innerHTML = '';
    
    biData.sales.topPerformers.forEach((performer, index) => {
        const performerItem = document.createElement('div');
        performerItem.className = 'performer-item';
        performerItem.innerHTML = `
            <div class="performer-info">
                <div class="performer-avatar">${performer.name.charAt(0)}</div>
                <div class="performer-details">
                    <div class="performer-name">${performer.name}</div>
                    <div class="performer-role">${performer.role}</div>
                </div>
            </div>
            <div class="performer-sales">$${performer.sales.toLocaleString()}</div>
        `;
        performersList.appendChild(performerItem);
    });
}

// Operations tab
function loadOperations() {
    createInventoryChart();
    createEfficiencyChart();
    createFulfillmentChart();
    createQualityChart();
}

function createInventoryChart() {
    const ctx = document.getElementById('inventory-chart');
    if (!ctx) return;
    
    if (charts.inventory) {
        charts.inventory.destroy();
    }
    
    charts.inventory = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['In Stock', 'Low Stock', 'Out of Stock'],
            datasets: [{
                data: [87, 10, 3],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createEfficiencyChart() {
    const ctx = document.getElementById('efficiency-chart');
    if (!ctx) return;
    
    if (charts.efficiency) {
        charts.efficiency.destroy();
    }
    
    charts.efficiency = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Efficiency %',
                data: [91.2, 92.8, 93.5, 94.2],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 85,
                    max: 100
                }
            }
        }
    });
}

function createFulfillmentChart() {
    const ctx = document.getElementById('fulfillment-chart');
    if (!ctx) return;
    
    if (charts.fulfillment) {
        charts.fulfillment.destroy();
    }
    
    charts.fulfillment = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Processing Time (days)',
                data: [2.1, 2.3, 2.0, 2.4, 2.2],
                backgroundColor: '#667eea',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createQualityChart() {
    const ctx = document.getElementById('quality-chart');
    if (!ctx) return;
    
    if (charts.quality) {
        charts.quality.destroy();
    }
    
    charts.quality = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Quality Score',
                data: [98.5, 98.8, 99.0, 98.9, 99.1, 99.1],
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 95,
                    max: 100
                }
            }
        }
    });
}

// Customers tab
function loadCustomers() {
    createSegmentationChart();
    createLTVChart();
}

function createSegmentationChart() {
    const ctx = document.getElementById('segmentation-chart');
    if (!ctx) return;
    
    if (charts.segmentation) {
        charts.segmentation.destroy();
    }
    
    charts.segmentation = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: biData.customers.segmentation.labels,
            datasets: [{
                data: biData.customers.segmentation.data,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createLTVChart() {
    const ctx = document.getElementById('ltv-chart');
    if (!ctx) return;
    
    if (charts.ltv) {
        charts.ltv.destroy();
    }
    
    charts.ltv = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0-6M', '6-12M', '1-2Y', '2-5Y', '5Y+'],
            datasets: [{
                label: 'Average LTV',
                data: [850, 1850, 3200, 5600, 8900],
                backgroundColor: '#667eea',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

// Financial tab
function loadFinancial() {
    createRevenueExpenseChart();
    createCashflowChart();
}

function createRevenueExpenseChart() {
    const ctx = document.getElementById('revenue-expense-chart');
    if (!ctx) return;
    
    if (charts.revenueExpense) {
        charts.revenueExpense.destroy();
    }
    
    charts.revenueExpense = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: biData.financial.monthlyData.labels,
            datasets: [{
                label: 'Revenue',
                data: biData.financial.monthlyData.revenue,
                backgroundColor: '#667eea',
                borderRadius: 4
            }, {
                label: 'Expenses',
                data: biData.financial.monthlyData.expenses,
                backgroundColor: '#f5576c',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value/1000) + 'K';
                        }
                    }
                }
            }
        }
    });
}

function createCashflowChart() {
    const ctx = document.getElementById('cashflow-chart');
    if (!ctx) return;
    
    if (charts.cashflow) {
        charts.cashflow.destroy();
    }
    
    const cashflowData = biData.financial.monthlyData.revenue.map((revenue, index) => 
        revenue - biData.financial.monthlyData.expenses[index]
    );
    
    charts.cashflow = new Chart(ctx, {
        type: 'line',
        data: {
            labels: biData.financial.monthlyData.labels,
            datasets: [{
                label: 'Net Cash Flow',
                data: cashflowData,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value/1000) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// Filter functionality
function setupFilters() {
    const filters = document.querySelectorAll('select');
    filters.forEach(filter => {
        filter.addEventListener('change', function() {
            applyFilter(this.id, this.value);
        });
    });
    
    const segmentButtons = document.querySelectorAll('.segment-btn');
    segmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const segment = this.dataset.segment;
            
            segmentButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            applySegmentFilter(segment);
        });
    });
}

function applyFilter(filterId, value) {
    console.log(`Filter ${filterId} applied with value: ${value}`);
    // Implement filter logic here
}

function applySegmentFilter(segment) {
    console.log(`Segment filter applied: ${segment}`);
    // Implement segment filter logic here
}

// Utility functions
function exportData() {
    alert('Export functionality would be implemented here');
}

function refreshData() {
    // Simulate data refresh
    const refreshButtons = document.querySelectorAll('.btn-primary');
    refreshButtons.forEach(btn => {
        if (btn.textContent.includes('Refresh')) {
            btn.textContent = 'Refreshing...';
            setTimeout(() => {
                btn.textContent = 'Refresh';
                // Reload current tab
                const activeTab = document.querySelector('.nav-item.active').dataset.tab;
                loadTabContent(activeTab);
            }, 2000);
        }
    });
}

function generateReport() {
    alert('Custom report generation would be implemented here');
}

function viewReport(reportType) {
    alert(`Opening ${reportType} report...`);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Alt + number keys for tab navigation
        if (e.altKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const tabs = ['overview', 'sales', 'operations', 'customers', 'financial', 'reports'];
            const tabIndex = parseInt(e.key) - 1;
            if (tabs[tabIndex]) {
                router.navigate(`#${tabs[tabIndex]}`);
            }
        }
        
        // Ctrl/Cmd + R for refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshData();
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportData();
        }
    });
}

// Auto-refresh data every 5 minutes
setInterval(() => {
    console.log('Auto-refreshing data...');
    const activeTab = document.querySelector('.nav-item.active').dataset.tab;
    loadTabContent(activeTab);
}, 300000);

// Window resize handler for charts
window.addEventListener('resize', function() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                try {
                    chart.resize();
                } catch (e) {
                    console.warn('Chart resize failed:', e);
                }
            }
        });
    }, 250);
});

// Destroy all charts when page is unloaded
window.addEventListener('beforeunload', function() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
});