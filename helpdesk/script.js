// Help desk JavaScript

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
        subject: 'Login issues with email client',
        status: 'open',
        priority: 'high',
        requester: 'sofia.marchetti@westbrook.example',
        agent: 'Hannah Kowalski',
        created: '2026-09-28T09:30:00Z',
        category: 'software',
        description: 'Unable to connect to email server after password change'
    },
    {
        id: 'TKT-002',
        subject: 'Printer not working in conference room',
        status: 'in-progress',
        priority: 'normal',
        requester: 'mateo.alvarez@westbrook.example',
        agent: 'Kwame Mensah',
        created: '2026-09-28T11:45:00Z',
        category: 'hardware',
        description: 'Conference room printer shows offline status'
    },
    {
        id: 'TKT-003',
        subject: 'VPN connection timeout',
        status: 'urgent',
        priority: 'urgent',
        requester: 'yuki.tanaka@westbrook.example',
        agent: 'Rajesh Iyer',
        created: '2026-09-29T14:20:00Z',
        category: 'network',
        description: 'Cannot establish VPN connection from home office'
    },
    {
        id: 'TKT-004',
        subject: 'Software license request',
        status: 'pending',
        priority: 'low',
        requester: 'fatima.al-sayed@westbrook.example',
        agent: 'Hannah Kowalski',
        created: '2026-09-30T16:15:00Z',
        category: 'software',
        description: 'Need an additional license for the design software'
    },
    {
        id: 'TKT-005',
        subject: 'Account access request',
        status: 'resolved',
        priority: 'normal',
        requester: 'oliver.grant@westbrook.example',
        agent: 'Kwame Mensah',
        created: '2026-09-30T10:30:00Z',
        category: 'access',
        description: 'New employee needs access to project management system'
    }
];

const sampleUsers = [
    {
        name: 'Sofia Marchetti',
        email: 'sofia.marchetti@westbrook.example',
        department: 'Engineering',
        role: 'Developer',
        ticketsCreated: 12,
        lastActive: '2026-09-30T14:30:00Z'
    },
    {
        name: 'Mateo Alvarez',
        email: 'mateo.alvarez@westbrook.example',
        department: 'Marketing',
        role: 'Marketing Manager',
        ticketsCreated: 8,
        lastActive: '2026-09-30T13:45:00Z'
    },
    {
        name: 'Yuki Tanaka',
        email: 'yuki.tanaka@westbrook.example',
        department: 'Sales',
        role: 'Sales Representative',
        ticketsCreated: 15,
        lastActive: '2026-09-30T16:20:00Z'
    },
    {
        name: 'Fatima Al-Sayed',
        email: 'fatima.al-sayed@westbrook.example',
        department: 'Design',
        role: 'UI/UX Designer',
        ticketsCreated: 6,
        lastActive: '2026-09-29T12:10:00Z'
    }
];

const sampleKnowledge = [
    {
        title: 'How to reset your email password',
        category: 'software',
        views: 245,
        lastUpdated: '2026-09-10',
        content: 'Step-by-step guide to reset your email password...'
    },
    {
        title: 'VPN setup guide',
        category: 'network',
        views: 189,
        lastUpdated: '2026-09-08',
        content: 'Complete guide to setting up VPN connection...'
    },
    {
        title: 'Printer troubleshooting',
        category: 'hardware',
        views: 156,
        lastUpdated: '2026-09-12',
        content: 'Common printer issues and their solutions...'
    }
];

// Badge tones (see shared/theme.css)
const statusTones = {
    'open': 'info',
    'in-progress': 'neutral',
    'pending': 'warning',
    'urgent': 'danger',
    'resolved': 'success',
    'closed': 'neutral'
};

const priorityTones = {
    'low': 'neutral',
    'normal': 'neutral',
    'high': 'warning',
    'urgent': 'danger'
};

// Read a theme token so canvas charts use the same colours as the CSS
function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function statusBadge(status) {
    return `<span class="ticket-status status-badge ${status} tone-${statusTones[status] || 'neutral'}">${status.replace('-', ' ')}</span>`;
}

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
        document.title = `${navItem.querySelector('span:not(.badge)').textContent.trim()} | Help desk | Westbrook Industries`;
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
                <div class="ticket-meta">${ticket.id}, ${ticket.requester}</div>
            </div>
            ${statusBadge(ticket.status)}
        `;
        container.appendChild(ticketElement);
    });
}

function loadAgentPerformance() {
    const container = document.getElementById('agent-performance');
    if (!container) return;
    
    const agents = [
        { name: 'Hannah Kowalski', resolved: 23, avg: '2.4h' },
        { name: 'Kwame Mensah', resolved: 19, avg: '3.1h' },
        { name: 'Rajesh Iyer', resolved: 15, avg: '2.8h' }
    ];
    
    container.innerHTML = '';
    agents.forEach(agent => {
        const agentElement = document.createElement('div');
        agentElement.className = 'ticket-item';
        agentElement.innerHTML = `
            <div class="ticket-info">
                <div class="ticket-subject">${agent.name}</div>
                <div class="ticket-meta">Avg response: ${agent.avg}</div>
            </div>
            <span class="ticket-status status-badge resolved tone-neutral">${agent.resolved} resolved</span>
        `;
        container.appendChild(agentElement);
    });
}

// Canvas chart helpers (colours come from the theme tokens)
function chartFont() {
    return `12px ${getComputedStyle(document.body).fontFamily}`;
}

function drawPie(ctx, canvas, labels, values, colors, radius, centerX, centerY) {
    const total = values.reduce((sum, val) => sum + val, 0);
    let startAngle = -Math.PI / 2;
    ctx.strokeStyle = cssVar('--surface');
    ctx.lineWidth = 2;
    values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        startAngle += sliceAngle;
    });

    // Legend on the right
    ctx.font = chartFont();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const legendX = centerX + radius + 24;
    const legendY = centerY - ((labels.length - 1) * 11);
    labels.forEach((label, index) => {
        const y = legendY + index * 22;
        ctx.fillStyle = colors[index];
        ctx.fillRect(legendX, y - 5, 10, 10);
        ctx.fillStyle = cssVar('--text');
        ctx.fillText(`${label} (${values[index]})`, legendX + 16, y);
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
    const colors = [cssVar('--chart-5'), cssVar('--chart-1'), cssVar('--chart-3'), cssVar('--chart-6')];
    
    const radius = Math.min(canvas.width / 4, canvas.height / 2) - 12;
    drawPie(ctx, canvas, priorities, values, colors, radius, canvas.width / 4 + 8, canvas.height / 2);
}

function createResponseChart() {
    const canvas = document.getElementById('response-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const avgTimes = [2.4, 1.8, 3.2, 2.1, 2.7];
    
    const left = 36;
    const top = 16;
    const chartWidth = canvas.width - left - 16;
    const chartHeight = canvas.height - top - 28;
    const maxTime = 4;
    
    // Gridlines and axis labels (hours)
    ctx.font = chartFont();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.lineWidth = 1;
    for (let hours = 0; hours <= maxTime; hours++) {
        const y = top + chartHeight - (hours / maxTime) * chartHeight;
        ctx.strokeStyle = cssVar('--chart-grid');
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(left + chartWidth, y);
        ctx.stroke();
        ctx.fillStyle = cssVar('--text-muted');
        ctx.fillText(`${hours}h`, left - 8, y);
    }
    
    const points = avgTimes.map((time, index) => ({
        x: left + 16 + (index * ((chartWidth - 32) / (avgTimes.length - 1))),
        y: top + chartHeight - (time / maxTime) * chartHeight
    }));
    
    ctx.strokeStyle = cssVar('--chart-1');
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();
    
    ctx.textAlign = 'center';
    points.forEach((point, index) => {
        ctx.fillStyle = cssVar('--chart-1');
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = cssVar('--text-muted');
        ctx.fillText(days[index], point.x, top + chartHeight + 16);
    });
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
            <td>${statusBadge(ticket.status)}</td>
            <td><span class="priority-badge ${ticket.priority} tone-${priorityTones[ticket.priority] || 'neutral'}">${ticket.priority}</span></td>
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
            <div class="article-card" onclick="viewArticle('${article.title}')">
                <h4 class="article-title">${article.title}</h4>
                <div class="article-meta">
                    <span>Category: ${article.category}</span>
                    <span>${article.views} views</span>
                    <span>Updated: ${formatDate(article.lastUpdated)}</span>
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
    
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const volumes = [45, 52, 48, 61, 58, 65];
    
    const left = 36;
    const top = 16;
    const chartWidth = canvas.width - left - 16;
    const chartHeight = canvas.height - top - 32;
    const axisMax = 80;
    
    // Gridlines and axis labels
    ctx.font = chartFont();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.lineWidth = 1;
    for (let value = 0; value <= axisMax; value += 20) {
        const y = top + chartHeight - (value / axisMax) * chartHeight;
        ctx.strokeStyle = cssVar('--chart-grid');
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(left + chartWidth, y);
        ctx.stroke();
        ctx.fillStyle = cssVar('--text-muted');
        ctx.fillText(String(value), left - 8, y);
    }
    
    const slot = chartWidth / volumes.length;
    const barWidth = slot * 0.5;
    ctx.textAlign = 'center';
    volumes.forEach((volume, index) => {
        const barHeight = (volume / axisMax) * chartHeight;
        const x = left + index * slot + (slot - barWidth) / 2;
        const y = top + chartHeight - barHeight;
        
        ctx.fillStyle = cssVar('--chart-1');
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.fillStyle = cssVar('--text-muted');
        ctx.fillText(months[index], x + barWidth / 2, top + chartHeight + 16);
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
    const colors = [cssVar('--chart-5'), cssVar('--chart-1'), cssVar('--chart-4'), cssVar('--chart-6')];
    
    const radius = Math.min(canvas.width / 4, canvas.height / 2) - 24;
    drawPie(ctx, canvas, categories, counts, colors, radius, canvas.width / 4 + 8, canvas.height / 2);
}

function loadTopIssues() {
    const container = document.getElementById('top-issues');
    if (!container) return;
    
    const issues = [
        { title: 'Email login problems', count: 23 },
        { title: 'VPN connection issues', count: 18 },
        { title: 'Printer malfunctions', count: 15 },
        { title: 'Software license requests', count: 12 },
        { title: 'Account access requests', count: 9 }
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
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