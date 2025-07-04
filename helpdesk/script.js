// Help Desk & Ticketing System JavaScript

// Global variables
let tickets = [];
let users = [];
let knowledgeBase = [];
let currentPage = 1;
const pageSize = 10;

// Sample data
const sampleTickets = [
    {
        id: 'TKT-001',
        subject: 'Login Issues with Email Client',
        status: 'open',
        priority: 'high',
        requester: 'john.doe@nexuscorp.com',
        agent: 'Jane Smith',
        created: '2024-01-15T09:30:00Z',
        category: 'software',
        description: 'Unable to connect to email server after password change'
    },
    {
        id: 'TKT-002',
        subject: 'Printer Not Working in Conference Room',
        status: 'in-progress',
        priority: 'normal',
        requester: 'sarah.wilson@nexuscorp.com',
        agent: 'Mike Wilson',
        created: '2024-01-15T11:45:00Z',
        category: 'hardware',
        description: 'Conference room printer shows offline status'
    },
    {
        id: 'TKT-003',
        subject: 'VPN Connection Timeout',
        status: 'urgent',
        priority: 'urgent',
        requester: 'david.chen@nexuscorp.com',
        agent: 'John Doe',
        created: '2024-01-15T14:20:00Z',
        category: 'network',
        description: 'Cannot establish VPN connection from home office'
    },
    {
        id: 'TKT-004',
        subject: 'Software License Request',
        status: 'pending',
        priority: 'low',
        requester: 'emily.davis@nexuscorp.com',
        agent: 'Jane Smith',
        created: '2024-01-14T16:15:00Z',
        category: 'software',
        description: 'Need additional Adobe Creative Suite license'
    },
    {
        id: 'TKT-005',
        subject: 'Account Access Request',
        status: 'resolved',
        priority: 'normal',
        requester: 'robert.johnson@nexuscorp.com',
        agent: 'Mike Wilson',
        created: '2024-01-14T10:30:00Z',
        category: 'access',
        description: 'New employee needs access to project management system'
    }
];

const sampleUsers = [
    {
        name: 'John Doe',
        email: 'john.doe@nexuscorp.com',
        department: 'Engineering',
        role: 'Developer',
        ticketsCreated: 12,
        lastActive: '2024-01-15T14:30:00Z'
    },
    {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@nexuscorp.com',
        department: 'Marketing',
        role: 'Marketing Manager',
        ticketsCreated: 8,
        lastActive: '2024-01-15T13:45:00Z'
    },
    {
        name: 'David Chen',
        email: 'david.chen@nexuscorp.com',
        department: 'Sales',
        role: 'Sales Representative',
        ticketsCreated: 15,
        lastActive: '2024-01-15T16:20:00Z'
    },
    {
        name: 'Emily Davis',
        email: 'emily.davis@nexuscorp.com',
        department: 'Design',
        role: 'UI/UX Designer',
        ticketsCreated: 6,
        lastActive: '2024-01-15T12:10:00Z'
    }
];

const sampleKnowledge = [
    {
        title: 'How to Reset Email Password',
        category: 'software',
        views: 245,
        lastUpdated: '2024-01-10',
        content: 'Step-by-step guide to reset your email password...'
    },
    {
        title: 'VPN Setup Guide',
        category: 'network',
        views: 189,
        lastUpdated: '2024-01-08',
        content: 'Complete guide to setting up VPN connection...'
    },
    {
        title: 'Printer Troubleshooting',
        category: 'hardware',
        views: 156,
        lastUpdated: '2024-01-12',
        content: 'Common printer issues and their solutions...'
    }
];

// URL Router for SPA functionality
const router = {
    routes: {},
    
    init() {
        window.addEventListener('popstate', this.handlePopState.bind(this));
        this.handleRoute(window.location.hash || '#dashboard');
    },
    
    addRoute(path, callback) {
        this.routes[path] = callback;
    },
    
    navigate(path) {
        window.history.pushState({}, '', `${window.location.pathname}${path}`);
        this.handleRoute(path);
    },
    
    handlePopState(event) {
        this.handleRoute(window.location.hash || '#dashboard');
    },
    
    handleRoute(path) {
        const cleanPath = path.replace('#', '');
        const route = this.routes[cleanPath] || this.routes['dashboard'];
        if (route) route();
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    loadSampleData();
    setupEventListeners();
    setupKeyboardShortcuts();
}

// Navigation system with URL routing
function setupNavigation() {
    router.addRoute('dashboard', () => switchTab('dashboard'));
    router.addRoute('tickets', () => switchTab('tickets'));
    router.addRoute('knowledge', () => switchTab('knowledge'));
    router.addRoute('users', () => switchTab('users'));
    router.addRoute('reports', () => switchTab('reports'));
    router.addRoute('settings', () => switchTab('settings'));
    
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
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const navItem = document.querySelector(`[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(tabName);
    
    if (navItem && tabContent) {
        navItem.classList.add('active');
        tabContent.classList.add('active');
        document.title = `${navItem.textContent.trim()} - Help Desk - Nexus Corp`;
    }
    
    loadTabContent(tabName);
}

function loadTabContent(tabName) {
    setTimeout(() => {
        switch(tabName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'tickets':
                loadTickets();
                break;
            case 'knowledge':
                loadKnowledgeBase();
                break;
            case 'users':
                loadUsers();
                break;
            case 'reports':
                loadReports();
                break;
            case 'settings':
                loadSettings();
                break;
        }
    }, 100);
}

function loadSampleData() {
    tickets = [...sampleTickets];
    users = [...sampleUsers];
    knowledgeBase = [...sampleKnowledge];
}

function setupEventListeners() {
    // Ticket form submission
    const ticketForm = document.getElementById('ticket-form');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createNewTicket();
        });
    }
    
    // Filter listeners
    const filters = ['status-filter', 'priority-filter', 'agent-filter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', applyTicketFilters);
        }
    });
    
    // Search listener
    const searchInput = document.getElementById('search-tickets');
    if (searchInput) {
        searchInput.addEventListener('input', applyTicketFilters);
    }
}

// Dashboard functions
function loadDashboard() {
    loadRecentTickets();
    loadAgentPerformance();
    createPriorityChart();
    createResponseChart();
}

function loadRecentTickets() {
    const container = document.getElementById('recent-tickets');
    if (!container) return;
    
    container.innerHTML = '';
    const recentTickets = tickets.slice(0, 5);
    
    recentTickets.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.className = 'ticket-item';
        ticketElement.innerHTML = `
            <div class="ticket-info">
                <div class="ticket-subject">${ticket.subject}</div>
                <div class="ticket-meta">${ticket.id} • ${ticket.requester}</div>
            </div>
            <span class="ticket-status ${ticket.status}">${ticket.status.replace('-', ' ')}</span>
        `;
        container.appendChild(ticketElement);
    });
}

function loadAgentPerformance() {
    const container = document.getElementById('agent-performance');
    if (!container) return;
    
    const agents = [
        { name: 'Jane Smith', resolved: 23, avg: '2.4h' },
        { name: 'Mike Wilson', resolved: 19, avg: '3.1h' },
        { name: 'John Doe', resolved: 15, avg: '2.8h' }
    ];
    
    container.innerHTML = '';
    agents.forEach(agent => {
        const agentElement = document.createElement('div');
        agentElement.className = 'ticket-item';
        agentElement.innerHTML = `
            <div class="ticket-info">
                <div class="ticket-subject">${agent.name}</div>
                <div class="ticket-meta">Avg Response: ${agent.avg}</div>
            </div>
            <span class="ticket-status resolved">${agent.resolved} resolved</span>
        `;
        container.appendChild(agentElement);
    });
}

function createPriorityChart() {
    const canvas = document.getElementById('priority-chart');
    if (!canvas) return;
    
    // Simple canvas chart implementation
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    const priorities = ['Low', 'Normal', 'High', 'Urgent'];
    const values = [12, 18, 8, 3];
    const colors = ['#27ae60', '#3498db', '#f39c12', '#e74c3c'];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    let startAngle = 0;
    const total = values.reduce((sum, val) => sum + val, 0);
    
    values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        startAngle += sliceAngle;
    });
}

function createResponseChart() {
    const canvas = document.getElementById('response-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const avgTimes = [2.4, 1.8, 3.2, 2.1, 2.7];
    
    const chartWidth = canvas.width - 60;
    const chartHeight = canvas.height - 40;
    const maxTime = Math.max(...avgTimes);
    
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    avgTimes.forEach((time, index) => {
        const x = 30 + (index * (chartWidth / (avgTimes.length - 1)));
        const y = 20 + (chartHeight - (time / maxTime) * chartHeight);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.stroke();
}

// Ticket management functions
function loadTickets() {
    renderTicketsTable();
    setupPagination();
}

function renderTicketsTable() {
    const tbody = document.getElementById('tickets-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTickets = getFilteredTickets().slice(startIndex, endIndex);
    
    paginatedTickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" value="${ticket.id}"></td>
            <td>${ticket.id}</td>
            <td>${ticket.subject}</td>
            <td><span class="ticket-status ${ticket.status}">${ticket.status.replace('-', ' ')}</span></td>
            <td><span class="priority-badge ${ticket.priority}">${ticket.priority}</span></td>
            <td>${ticket.requester}</td>
            <td>${ticket.agent || 'Unassigned'}</td>
            <td>${formatDate(ticket.created)}</td>
            <td>
                <button class="action-btn" onclick="editTicket('${ticket.id}')">Edit</button>
                <button class="action-btn secondary" onclick="viewTicket('${ticket.id}')">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getFilteredTickets() {
    let filtered = [...tickets];
    
    const statusFilter = document.getElementById('status-filter')?.value;
    const priorityFilter = document.getElementById('priority-filter')?.value;
    const agentFilter = document.getElementById('agent-filter')?.value;
    const searchTerm = document.getElementById('search-tickets')?.value.toLowerCase();
    
    if (statusFilter) {
        filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    if (priorityFilter) {
        filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    if (agentFilter) {
        filtered = filtered.filter(ticket => ticket.agent === agentFilter);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(ticket => 
            ticket.subject.toLowerCase().includes(searchTerm) ||
            ticket.id.toLowerCase().includes(searchTerm) ||
            ticket.requester.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

function applyTicketFilters() {
    currentPage = 1;
    renderTicketsTable();
    setupPagination();
}

function setupPagination() {
    const filteredTickets = getFilteredTickets();
    const totalPages = Math.ceil(filteredTickets.length / pageSize);
    const paginationContainer = document.getElementById('tickets-pagination');
    
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.addEventListener('click', () => {
            currentPage = i;
            renderTicketsTable();
            setupPagination();
        });
        paginationContainer.appendChild(button);
    }
}

// Knowledge Base functions
function loadKnowledgeBase() {
    renderKnowledgeArticles();
}

function renderKnowledgeArticles() {
    const container = document.getElementById('kb-articles');
    if (!container) return;
    
    container.innerHTML = '';
    knowledgeBase.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'article-item';
        articleElement.innerHTML = `
            <div style="background: white; padding: 20px; margin-bottom: 15px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); cursor: pointer;" onclick="viewArticle('${article.title}')">
                <h4 style="color: #2c3e50; margin-bottom: 10px;">${article.title}</h4>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9em; color: #7f8c8d;">
                    <span>Category: ${article.category}</span>
                    <span>${article.views} views</span>
                    <span>Updated: ${article.lastUpdated}</span>
                </div>
            </div>
        `;
        container.appendChild(articleElement);
    });
}

// User management functions
function loadUsers() {
    renderUsersTable();
}

function renderUsersTable() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.department}</td>
            <td>${user.role}</td>
            <td>${user.ticketsCreated}</td>
            <td>${formatDate(user.lastActive)}</td>
            <td>
                <button class="action-btn" onclick="editUser('${user.email}')">Edit</button>
                <button class="action-btn secondary" onclick="viewUser('${user.email}')">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Reports functions
function loadReports() {
    createVolumeChart();
    createResolutionChart();
    loadTopIssues();
}

function createVolumeChart() {
    const canvas = document.getElementById('volume-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const volumes = [45, 52, 48, 61, 58, 65];
    
    const chartWidth = canvas.width - 60;
    const chartHeight = canvas.height - 60;
    const maxVolume = Math.max(...volumes);
    
    ctx.fillStyle = '#e74c3c';
    volumes.forEach((volume, index) => {
        const barWidth = chartWidth / volumes.length - 10;
        const barHeight = (volume / maxVolume) * chartHeight;
        const x = 30 + index * (chartWidth / volumes.length);
        const y = chartHeight - barHeight + 30;
        
        ctx.fillRect(x, y, barWidth, barHeight);
    });
}

function createResolutionChart() {
    const canvas = document.getElementById('resolution-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const categories = ['< 1h', '1-4h', '4-24h', '> 24h'];
    const counts = [15, 28, 12, 5];
    const colors = ['#27ae60', '#f39c12', '#e67e22', '#e74c3c'];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;
    
    let startAngle = 0;
    const total = counts.reduce((sum, count) => sum + count, 0);
    
    counts.forEach((count, index) => {
        const sliceAngle = (count / total) * 2 * Math.PI;
        
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        startAngle += sliceAngle;
    });
}

function loadTopIssues() {
    const container = document.getElementById('top-issues');
    if (!container) return;
    
    const issues = [
        { title: 'Email Login Problems', count: 23 },
        { title: 'VPN Connection Issues', count: 18 },
        { title: 'Printer Malfunctions', count: 15 },
        { title: 'Software License Requests', count: 12 },
        { title: 'Account Access Requests', count: 9 }
    ];
    
    container.innerHTML = '';
    issues.forEach(issue => {
        const issueElement = document.createElement('div');
        issueElement.className = 'issue-item';
        issueElement.innerHTML = `
            <span class="issue-title">${issue.title}</span>
            <span class="issue-count">${issue.count}</span>
        `;
        container.appendChild(issueElement);
    });
}

// Settings functions
function loadSettings() {
    // Settings are loaded from HTML, no additional loading needed
}

// Modal functions
function createTicket() {
    document.getElementById('ticket-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function createNewTicket() {
    const formData = {
        subject: document.getElementById('ticket-subject').value,
        priority: document.getElementById('ticket-priority').value,
        requester: document.getElementById('ticket-requester').value,
        category: document.getElementById('ticket-category').value,
        description: document.getElementById('ticket-description').value
    };
    
    const newTicket = {
        id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: formData.subject,
        status: 'open',
        priority: formData.priority,
        requester: formData.requester,
        agent: null,
        created: new Date().toISOString(),
        category: formData.category,
        description: formData.description
    };
    
    tickets.unshift(newTicket);
    closeModal('ticket-modal');
    document.getElementById('ticket-form').reset();
    
    if (document.querySelector('[data-tab="tickets"]').classList.contains('active')) {
        renderTicketsTable();
        setupPagination();
    }
    
    alert('Ticket created successfully!');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function editTicket(ticketId) {
    alert(`Edit ticket ${ticketId} functionality would be implemented here`);
}

function viewTicket(ticketId) {
    alert(`View ticket ${ticketId} functionality would be implemented here`);
}

function editUser(email) {
    alert(`Edit user ${email} functionality would be implemented here`);
}

function viewUser(email) {
    alert(`View user ${email} functionality would be implemented here`);
}

function bulkUpdate() {
    alert('Bulk update functionality would be implemented here');
}

function createArticle() {
    alert('Create article functionality would be implemented here');
}

function importArticles() {
    alert('Import articles functionality would be implemented here');
}

function addUser() {
    alert('Add user functionality would be implemented here');
}

function exportUsers() {
    alert('Export users functionality would be implemented here');
}

function generateReport() {
    alert('Generate report functionality would be implemented here');
}

function scheduleReport() {
    alert('Schedule report functionality would be implemented here');
}

function saveSettings() {
    alert('Settings saved successfully!');
}

function refreshDashboard() {
    loadDashboard();
    alert('Dashboard refreshed!');
}

function filterKB(category) {
    alert(`Filter knowledge base by ${category} category`);
}

function viewArticle(title) {
    alert(`View article: ${title}`);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const tabs = ['dashboard', 'tickets', 'knowledge', 'users', 'reports', 'settings'];
            const tabIndex = parseInt(e.key) - 1;
            if (tabs[tabIndex]) {
                router.navigate(`#${tabs[tabIndex]}`);
            }
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const activeTab = document.querySelector('.tab-content.active').id;
            if (activeTab === 'tickets') {
                createTicket();
            }
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});