// CRM Application JavaScript

// Sample data - Extended customer list for pagination demo
let customers = [
    {
        id: 1,
        company: "Acme Corporation",
        contact: "John Davis",
        email: "john.davis@acme.com",
        phone: "+1 (555) 123-4567",
        industry: "Technology",
        status: "active",
        lastContact: "2024-06-28",
        jobTitle: "CTO",
        address: "123 Tech Street, San Francisco, CA 94102",
        revenue: "$5,000,000",
        employees: 150,
        notes: "Key decision maker for enterprise software purchases. Very interested in our Q4 offerings."
    },
    {
        id: 2,
        company: "TechStart Inc",
        contact: "Sarah Wilson",
        email: "sarah.wilson@techstart.com",
        phone: "+1 (555) 987-6543",
        industry: "Technology",
        status: "active",
        lastContact: "2024-06-30",
        jobTitle: "VP of Operations",
        address: "456 Innovation Ave, Austin, TX 78701",
        revenue: "$1,200,000",
        employees: 45,
        notes: "Startup with rapid growth. Recently closed Series A funding."
    },
    {
        id: 3,
        company: "Global Systems",
        contact: "Michael Chen",
        email: "m.chen@globalsystems.com",
        phone: "+1 (555) 456-7890",
        industry: "Manufacturing",
        status: "prospect",
        lastContact: "2024-06-25",
        jobTitle: "Director of IT",
        address: "789 Industrial Blvd, Detroit, MI 48201",
        revenue: "$15,000,000",
        employees: 500,
        notes: "Large manufacturing company looking to modernize their IT infrastructure."
    },
    {
        id: 4,
        company: "HealthCare Solutions",
        contact: "Dr. Emily Rodriguez",
        email: "e.rodriguez@healthcaresol.com",
        phone: "+1 (555) 321-0987",
        industry: "Healthcare",
        status: "active",
        lastContact: "2024-06-29",
        jobTitle: "Chief Medical Officer",
        address: "321 Medical Center Dr, Boston, MA 02101",
        revenue: "$8,500,000",
        employees: 200,
        notes: "Healthcare provider interested in patient management systems."
    },
    {
        id: 5,
        company: "Finance First",
        contact: "Robert Thompson",
        email: "r.thompson@financefirst.com",
        phone: "+1 (555) 654-3210",
        industry: "Finance",
        status: "inactive",
        lastContact: "2024-05-15",
        jobTitle: "CFO",
        address: "987 Wall Street, New York, NY 10005",
        revenue: "$25,000,000",
        employees: 300,
        notes: "Previous client. Contract expired last month. Good relationship maintained."
    },
    {
        id: 6,
        company: "InnovateTech Solutions",
        contact: "Lisa Zhang",
        email: "l.zhang@innovatetech.com",
        phone: "+1 (555) 789-0123",
        industry: "Technology",
        status: "active",
        lastContact: "2024-07-01",
        jobTitle: "CEO",
        address: "890 Innovation Way, Seattle, WA 98101",
        revenue: "$3,200,000",
        employees: 75,
        notes: "AI startup looking for enterprise integration tools."
    },
    {
        id: 7,
        company: "Metro Construction",
        contact: "David Martinez",
        email: "d.martinez@metroconstruction.com",
        phone: "+1 (555) 234-5678",
        industry: "Construction",
        status: "prospect",
        lastContact: "2024-06-20",
        jobTitle: "Project Manager",
        address: "567 Builder Ave, Phoenix, AZ 85001",
        revenue: "$12,000,000",
        employees: 250,
        notes: "Large construction firm interested in project management software."
    },
    {
        id: 8,
        company: "EduLearn Academy",
        contact: "Professor Amanda White",
        email: "a.white@edulearn.edu",
        phone: "+1 (555) 345-6789",
        industry: "Education",
        status: "active",
        lastContact: "2024-06-27",
        jobTitle: "Academic Director",
        address: "432 Education Blvd, Chicago, IL 60601",
        revenue: "$2,800,000",
        employees: 120,
        notes: "Educational institution seeking student management systems."
    },
    {
        id: 9,
        company: "GreenEnergy Corp",
        contact: "Mark Johnson",
        email: "m.johnson@greenenergy.com",
        phone: "+1 (555) 456-7890",
        industry: "Energy",
        status: "active",
        lastContact: "2024-06-26",
        jobTitle: "Operations Director",
        address: "123 Solar St, Denver, CO 80201",
        revenue: "$18,500,000",
        employees: 400,
        notes: "Renewable energy company expanding their digital infrastructure."
    },
    {
        id: 10,
        company: "RetailMax",
        contact: "Jennifer Brown",
        email: "j.brown@retailmax.com",
        phone: "+1 (555) 567-8901",
        industry: "Retail",
        status: "prospect",
        lastContact: "2024-06-22",
        jobTitle: "IT Director",
        address: "789 Commerce Dr, Atlanta, GA 30301",
        revenue: "$45,000,000",
        employees: 1200,
        notes: "Large retail chain considering e-commerce platform upgrade."
    },
    {
        id: 11,
        company: "BioTech Innovations",
        contact: "Dr. Kevin Lee",
        email: "k.lee@biotechinnovations.com",
        phone: "+1 (555) 678-9012",
        industry: "Biotechnology",
        status: "active",
        lastContact: "2024-07-02",
        jobTitle: "Research Director",
        address: "456 Science Park, San Diego, CA 92101",
        revenue: "$7,300,000",
        employees: 180,
        notes: "Biotech company needing lab management systems."
    },
    {
        id: 12,
        company: "LogiFlow Transport",
        contact: "Maria Garcia",
        email: "m.garcia@logiflow.com",
        phone: "+1 (555) 789-0123",
        industry: "Transportation",
        status: "inactive",
        lastContact: "2024-05-10",
        jobTitle: "Fleet Manager",
        address: "321 Transport Way, Dallas, TX 75201",
        revenue: "$22,000,000",
        employees: 800,
        notes: "Logistics company with expired contract. Potential for renewal."
    },
    {
        id: 13,
        company: "Digital Marketing Pro",
        contact: "Alex Kim",
        email: "a.kim@digitalmarketingpro.com",
        phone: "+1 (555) 890-1234",
        industry: "Marketing",
        status: "active",
        lastContact: "2024-06-29",
        jobTitle: "Creative Director",
        address: "654 Marketing Blvd, Los Angeles, CA 90210",
        revenue: "$4,100,000",
        employees: 95,
        notes: "Marketing agency interested in client management tools."
    },
    {
        id: 14,
        company: "MediCare Plus",
        contact: "Dr. Susan Taylor",
        email: "s.taylor@medicareplus.com",
        phone: "+1 (555) 901-2345",
        industry: "Healthcare",
        status: "prospect",
        lastContact: "2024-06-24",
        jobTitle: "Chief Information Officer",
        address: "987 Health Ave, Miami, FL 33101",
        revenue: "$31,000,000",
        employees: 750,
        notes: "Large healthcare provider evaluating EMR systems."
    },
    {
        id: 15,
        company: "SmartHome Technologies",
        contact: "Ryan Cooper",
        email: "r.cooper@smarthometech.com",
        phone: "+1 (555) 012-3456",
        industry: "Technology",
        status: "active",
        lastContact: "2024-07-01",
        jobTitle: "Product Manager",
        address: "159 Innovation Dr, Portland, OR 97201",
        revenue: "$6,800,000",
        employees: 140,
        notes: "IoT company developing smart home solutions."
    },
    {
        id: 16,
        company: "Capital Investments",
        contact: "Thomas Wilson",
        email: "t.wilson@capitalinvestments.com",
        phone: "+1 (555) 123-4567",
        industry: "Finance",
        status: "active",
        lastContact: "2024-06-28",
        jobTitle: "Investment Manager",
        address: "753 Financial St, New York, NY 10004",
        revenue: "$89,000,000",
        employees: 420,
        notes: "Investment firm requiring portfolio management tools."
    },
    {
        id: 17,
        company: "AgroTech Farms",
        contact: "Hannah Miller",
        email: "h.miller@agrotechfarms.com",
        phone: "+1 (555) 234-5678",
        industry: "Agriculture",
        status: "prospect",
        lastContact: "2024-06-21",
        jobTitle: "Farm Operations Manager",
        address: "852 Rural Route, Des Moines, IA 50301",
        revenue: "$9,500,000",
        employees: 230,
        notes: "Agricultural technology company exploring farm management software."
    },
    {
        id: 18,
        company: "CloudFirst Solutions",
        contact: "Daniel Rodriguez",
        email: "d.rodriguez@cloudfirst.com",
        phone: "+1 (555) 345-6789",
        industry: "Technology",
        status: "active",
        lastContact: "2024-06-30",
        jobTitle: "Solutions Architect",
        address: "741 Cloud Ave, Austin, TX 78702",
        revenue: "$14,200,000",
        employees: 320,
        notes: "Cloud services provider interested in infrastructure monitoring."
    },
    {
        id: 19,
        company: "Fashion Forward",
        contact: "Isabella Jones",
        email: "i.jones@fashionforward.com",
        phone: "+1 (555) 456-7890",
        industry: "Fashion",
        status: "inactive",
        lastContact: "2024-04-15",
        jobTitle: "Brand Manager",
        address: "963 Style St, Los Angeles, CA 90028",
        revenue: "$12,800,000",
        employees: 280,
        notes: "Fashion retailer with lapsed subscription. Strong brand recognition."
    },
    {
        id: 20,
        company: "TechConsult Group",
        contact: "William Davis",
        email: "w.davis@techconsult.com",
        phone: "+1 (555) 567-8901",
        industry: "Consulting",
        status: "active",
        lastContact: "2024-07-02",
        jobTitle: "Senior Consultant",
        address: "258 Consulting Way, Washington, DC 20001",
        revenue: "$8,900,000",
        employees: 165,
        notes: "IT consulting firm providing services to government agencies."
    },
    {
        id: 21,
        company: "FoodService Masters",
        contact: "Rachel Green",
        email: "r.green@foodservicemasters.com",
        phone: "+1 (555) 678-9012",
        industry: "Food Service",
        status: "prospect",
        lastContact: "2024-06-23",
        jobTitle: "Operations Coordinator",
        address: "147 Culinary Blvd, New Orleans, LA 70112",
        revenue: "$16,700,000",
        employees: 650,
        notes: "Restaurant chain exploring POS and inventory management systems."
    },
    {
        id: 22,
        company: "SecureNet Cyber",
        contact: "Christopher Lee",
        email: "c.lee@securenetcyber.com",
        phone: "+1 (555) 789-0123",
        industry: "Cybersecurity",
        status: "active",
        lastContact: "2024-06-27",
        jobTitle: "Security Analyst",
        address: "369 Security Dr, Arlington, VA 22201",
        revenue: "$11,400,000",
        employees: 190,
        notes: "Cybersecurity firm specializing in enterprise threat detection."
    },
    {
        id: 23,
        company: "EcoSustain Industries",
        contact: "Samantha Clark",
        email: "s.clark@ecosustain.com",
        phone: "+1 (555) 890-1234",
        industry: "Environmental",
        status: "active",
        lastContact: "2024-06-25",
        jobTitle: "Environmental Director",
        address: "741 Green Way, Portland, OR 97205",
        revenue: "$5,600,000",
        employees: 110,
        notes: "Environmental consulting firm focused on sustainability solutions."
    },
    {
        id: 24,
        company: "RealEstate Pro",
        contact: "Matthew Turner",
        email: "m.turner@realestatepro.com",
        phone: "+1 (555) 901-2345",
        industry: "Real Estate",
        status: "prospect",
        lastContact: "2024-06-19",
        jobTitle: "Property Manager",
        address: "852 Property Ave, Las Vegas, NV 89101",
        revenue: "$28,300,000",
        employees: 520,
        notes: "Commercial real estate firm interested in property management software."
    },
    {
        id: 25,
        company: "AutoTech Solutions",
        contact: "Jessica Wang",
        email: "j.wang@autotechsolutions.com",
        phone: "+1 (555) 012-3456",
        industry: "Automotive",
        status: "active",
        lastContact: "2024-07-01",
        jobTitle: "Technical Lead",
        address: "159 Motor Way, Detroit, MI 48226",
        revenue: "$19,800,000",
        employees: 380,
        notes: "Automotive technology company developing connected car solutions."
    },
    {
        id: 26,
        company: "LegalEagle Law",
        contact: "Benjamin Adams",
        email: "b.adams@legaleagle.com",
        phone: "+1 (555) 123-4567",
        industry: "Legal",
        status: "inactive",
        lastContact: "2024-03-20",
        jobTitle: "Managing Partner",
        address: "753 Justice Blvd, Chicago, IL 60604",
        revenue: "$7,200,000",
        employees: 85,
        notes: "Law firm with expired case management software license."
    },
    {
        id: 27,
        company: "SportsTech Analytics",
        contact: "Nicole Phillips",
        email: "n.phillips@sportstech.com",
        phone: "+1 (555) 234-5678",
        industry: "Sports",
        status: "active",
        lastContact: "2024-06-26",
        jobTitle: "Data Scientist",
        address: "486 Athletic Ave, Orlando, FL 32801",
        revenue: "$3,900,000",
        employees: 65,
        notes: "Sports analytics company providing insights to professional teams."
    },
    {
        id: 28,
        company: "MusicStream Pro",
        contact: "Jordan Miller",
        email: "j.miller@musicstreampro.com",
        phone: "+1 (555) 345-6789",
        industry: "Entertainment",
        status: "prospect",
        lastContact: "2024-06-18",
        jobTitle: "Platform Engineer",
        address: "372 Music Row, Nashville, TN 37203",
        revenue: "$24,600,000",
        employees: 460,
        notes: "Music streaming platform evaluating content management systems."
    },
    {
        id: 29,
        company: "TravelMax Adventures",
        contact: "Sofia Rodriguez",
        email: "s.rodriguez@travelmax.com",
        phone: "+1 (555) 456-7890",
        industry: "Travel",
        status: "active",
        lastContact: "2024-06-24",
        jobTitle: "Travel Coordinator",
        address: "691 Adventure Blvd, Miami, FL 33126",
        revenue: "$13,500,000",
        employees: 240,
        notes: "Travel agency specializing in corporate and adventure travel packages."
    },
    {
        id: 30,
        company: "QuantumData Labs",
        contact: "Dr. Andrew Chen",
        email: "a.chen@quantumdata.com",
        phone: "+1 (555) 567-8901",
        industry: "Research",
        status: "active",
        lastContact: "2024-07-02",
        jobTitle: "Principal Researcher",
        address: "128 Quantum St, Cambridge, MA 02139",
        revenue: "$4,700,000",
        employees: 55,
        notes: "Quantum computing research lab requiring specialized data analysis tools."
    }
];

let opportunities = [
    {
        id: 1,
        company: "Acme Corporation",
        title: "Enterprise Software License",
        value: "$125,000",
        stage: "proposal",
        probability: "75%",
        closeDate: "2024-08-15"
    },
    {
        id: 2,
        company: "TechStart Inc",
        title: "Cloud Migration Services",
        value: "$85,000",
        stage: "qualification",
        probability: "60%",
        closeDate: "2024-09-30"
    },
    {
        id: 3,
        company: "Global Systems",
        title: "IT Infrastructure Upgrade",
        value: "$350,000",
        stage: "prospecting",
        probability: "25%",
        closeDate: "2024-12-01"
    }
];

// DOM Elements
const tabButtons = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const customerSearch = document.getElementById('customer-search');
const customersTableBody = document.getElementById('customers-tbody');

// Pagination variables
let currentPage = 1;
let pageSize = 10;
let filteredCustomers = [...customers];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    renderCustomersTable();
    renderOpportunityPipeline();
    setupSearchFilter();
    setupPagination();
});

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

// Tab functionality with URL routing
function initializeTabs() {
    // Setup routes
    router.addRoute('dashboard', () => switchTab('dashboard'));
    router.addRoute('customers', () => switchTab('customers'));
    router.addRoute('opportunities', () => switchTab('opportunities'));
    router.addRoute('activities', () => switchTab('activities'));
    router.addRoute('reports', () => switchTab('reports'));
    
    // Initialize router
    router.init();
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            router.navigate(`#${tabId}`);
        });
    });
}

function switchTab(tabId) {
    // Remove active class from all tabs and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
    const tabContent = document.getElementById(tabId);
    
    if (tabButton && tabContent) {
        tabButton.classList.add('active');
        tabContent.classList.add('active');
        
        // Update page title
        document.title = `${tabButton.textContent.trim()} - CRM System - Nexus Corp`;
    }
}

// Customer table rendering with pagination
function renderCustomersTable() {
    if (!customersTableBody) return;
    
    customersTableBody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    paginatedCustomers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${customer.company}</strong></td>
            <td>${customer.contact}<br><small>${customer.jobTitle || ''}</small></td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.industry}</td>
            <td><span class="status-badge ${customer.status}">${customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span></td>
            <td>${formatDate(customer.lastContact)}</td>
            <td>
                <button class="btn-secondary" onclick="editCustomer(${customer.id})" style="margin-right: 5px; padding: 5px 10px; font-size: 0.8em;">Edit</button>
                <button class="btn-secondary" onclick="viewCustomer(${customer.id})" style="padding: 5px 10px; font-size: 0.8em;">View</button>
            </td>
        `;
        customersTableBody.appendChild(row);
    });
    
    // Update pagination controls
    updatePaginationControls();
}

// Opportunity pipeline rendering
function renderOpportunityPipeline() {
    const stages = ['prospecting', 'qualification', 'proposal', 'closed-won'];
    
    stages.forEach(stage => {
        const container = document.getElementById(`${stage}-cards`);
        if (!container) return;
        
        container.innerHTML = '';
        
        const stageOpportunities = opportunities.filter(opp => opp.stage === stage);
        
        stageOpportunities.forEach(opp => {
            const card = document.createElement('div');
            card.className = 'opportunity-card';
            card.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 5px;">${opp.title}</div>
                <div style="color: #7f8c8d; font-size: 0.9em; margin-bottom: 5px;">${opp.company}</div>
                <div style="font-weight: bold; color: #27ae60;">${opp.value}</div>
                <div style="font-size: 0.8em; color: #95a5a6; margin-top: 5px;">Close: ${formatDate(opp.closeDate)}</div>
            `;
            container.appendChild(card);
        });
    });
}

// Search and filter functionality
function setupSearchFilter() {
    if (customerSearch) {
        customerSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterCustomers(searchTerm);
        });
    }
    
    // Industry filter
    const industryFilter = document.querySelector('.filter-select:nth-of-type(2)');
    if (industryFilter) {
        industryFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Status filter
    const statusFilter = document.querySelector('.filter-select:nth-of-type(1)');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
}

function filterCustomers(searchTerm) {
    applyFilters(searchTerm);
}

function applyFilters(searchTerm = '') {
    const currentSearchTerm = searchTerm || (customerSearch ? customerSearch.value.toLowerCase() : '');
    const industryFilter = document.querySelector('.filter-select:nth-of-type(2)');
    const statusFilter = document.querySelector('.filter-select:nth-of-type(1)');
    
    const selectedIndustry = industryFilter ? industryFilter.value.toLowerCase() : '';
    const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : '';
    
    filteredCustomers = customers.filter(customer => {
        const matchesSearch = !currentSearchTerm || 
            customer.company.toLowerCase().includes(currentSearchTerm) ||
            customer.contact.toLowerCase().includes(currentSearchTerm) ||
            customer.email.toLowerCase().includes(currentSearchTerm) ||
            customer.industry.toLowerCase().includes(currentSearchTerm);
            
        const matchesIndustry = !selectedIndustry || 
            customer.industry.toLowerCase() === selectedIndustry;
            
        const matchesStatus = !selectedStatus || 
            customer.status.toLowerCase() === selectedStatus;
            
        return matchesSearch && matchesIndustry && matchesStatus;
    });
    
    // Reset to first page when filtering
    currentPage = 1;
    renderCustomersTable();
}

// Modal functionality
function showAddCustomerForm() {
    document.getElementById('customer-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showAddOpportunityForm() {
    alert('Add Opportunity form would open here in a full implementation.');
}

// Customer CRUD operations
function addCustomer(customerData) {
    const newId = Math.max(...customers.map(c => c.id)) + 1;
    const newCustomer = {
        id: newId,
        ...customerData,
        lastContact: new Date().toISOString().split('T')[0]
    };
    
    customers.push(newCustomer);
    
    // Update filtered customers and refresh table
    applyFilters();
    closeModal('customer-modal');
}

function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        // In a real application, this would populate the form with customer data
        alert(`Edit Customer: ${customer.company}\n\nThis would open an edit form with the customer's current information.`);
    }
}

function viewCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        alert(`Customer Details: ${customer.company}\n\nContact: ${customer.contact}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nIndustry: ${customer.industry}\nStatus: ${customer.status}\nRevenue: ${customer.revenue}\nEmployees: ${customer.employees}\n\nNotes: ${customer.notes}`);
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Form submission handling
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('customer-form')) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const customerData = {
            company: formData.get('company') || '',
            contact: formData.get('contact') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            industry: formData.get('industry') || 'Other',
            status: 'prospect',
            jobTitle: formData.get('jobTitle') || '',
            address: formData.get('address') || '',
            revenue: formData.get('revenue') || '',
            employees: parseInt(formData.get('employees')) || 0,
            notes: formData.get('notes') || ''
        };
        
        // Basic validation
        if (!customerData.company || !customerData.contact || !customerData.email) {
            alert('Please fill in all required fields (Company Name, Contact Person, Email).');
            return;
        }
        
        addCustomer(customerData);
        e.target.reset();
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Sample activity form submission
document.addEventListener('submit', function(e) {
    if (e.target.closest('.activity-form')) {
        e.preventDefault();
        alert('Activity logged successfully!\n\nThis would save the activity data in a real implementation.');
        e.target.reset();
    }
});

// Report generation
function generateReport(reportType) {
    alert(`Generating ${reportType} report...\n\nThis would generate and download the requested report in a real implementation.`);
}

// Add some interactivity to report cards
document.addEventListener('DOMContentLoaded', function() {
    const reportButtons = document.querySelectorAll('.report-card .btn-secondary');
    reportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reportCard = this.closest('.report-card');
            const reportTitle = reportCard.querySelector('h3').textContent;
            generateReport(reportTitle);
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + 1-5 to switch tabs
    if (e.altKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        const tabs = ['dashboard', 'customers', 'opportunities', 'activities', 'reports'];
        if (tabs[tabIndex]) {
            router.navigate(`#${tabs[tabIndex]}`);
        }
    }
    
    // Ctrl/Cmd + N to add new customer (when on customers tab)
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === 'customers') {
            e.preventDefault();
            showAddCustomerForm();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            openModal.style.display = 'none';
        }
    }
});

// Pagination functionality
function setupPagination() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageSizeSelect = document.getElementById('page-size-select');
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderCustomersTable();
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredCustomers.length / pageSize);
            if (currentPage < totalPages) {
                currentPage++;
                renderCustomersTable();
            }
        });
    }
    
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', function() {
            pageSize = parseInt(this.value);
            currentPage = 1; // Reset to first page
            renderCustomersTable();
        });
    }
}

function updatePaginationControls() {
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    
    // Update pagination info
    const paginationInfoText = document.getElementById('pagination-info-text');
    if (paginationInfoText) {
        paginationInfoText.textContent = `Showing ${startItem}-${endItem} of ${totalItems} customers`;
    }
    
    // Update previous button
    const prevButton = document.getElementById('prev-page');
    if (prevButton) {
        prevButton.disabled = currentPage === 1;
    }
    
    // Update next button
    const nextButton = document.getElementById('next-page');
    if (nextButton) {
        nextButton.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Update page numbers
    updatePageNumbers(totalPages);
}

function updatePageNumbers(totalPages) {
    const paginationNumbers = document.getElementById('pagination-numbers');
    if (!paginationNumbers) return;
    
    paginationNumbers.innerHTML = '';
    
    // Show up to 5 page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // Add "..." before if needed
    if (startPage > 1) {
        addPageNumber(1);
        if (startPage > 2) {
            addEllipsis();
        }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        addPageNumber(i);
    }
    
    // Add "..." after if needed
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            addEllipsis();
        }
        addPageNumber(totalPages);
    }
}

function addPageNumber(pageNumber) {
    const paginationNumbers = document.getElementById('pagination-numbers');
    const pageButton = document.createElement('button');
    pageButton.className = `pagination-number ${pageNumber === currentPage ? 'active' : ''}`;
    pageButton.textContent = pageNumber;
    pageButton.addEventListener('click', function() {
        currentPage = pageNumber;
        renderCustomersTable();
    });
    paginationNumbers.appendChild(pageButton);
}

function addEllipsis() {
    const paginationNumbers = document.getElementById('pagination-numbers');
    const ellipsis = document.createElement('span');
    ellipsis.className = 'pagination-ellipsis';
    ellipsis.textContent = '...';
    paginationNumbers.appendChild(ellipsis);
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredCustomers.length / pageSize);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderCustomersTable();
    }
}

console.log('Nexus CRM System initialized successfully!');