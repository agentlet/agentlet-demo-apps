// CRM Application JavaScript

// Sample data - extended customer list for pagination demo
let customers = [
    {
        id: 1,
        company: "Harlow Dynamics",
        contact: "Anil Menon",
        email: "a.menon@harlowdynamics.com",
        phone: "+1 (415) 555-0142",
        industry: "Technology",
        status: "active",
        lastContact: "2026-09-24",
        jobTitle: "CTO",
        address: "123 Tech Street, San Francisco, CA 94102",
        revenue: "$5,000,000",
        employees: 150,
        notes: "Key decision maker for enterprise software purchases. Interested in our Q4 offerings."
    },
    {
        id: 2,
        company: "Brightwater Software",
        contact: "Camille Fournier",
        email: "c.fournier@brightwatersoftware.com",
        phone: "+1 (512) 555-0187",
        industry: "Technology",
        status: "active",
        lastContact: "2026-09-28",
        jobTitle: "VP of Operations",
        address: "456 Innovation Ave, Austin, TX 78701",
        revenue: "$1,200,000",
        employees: 45,
        notes: "Fast-growing software company. Closed a Series A round in the spring."
    },
    {
        id: 3,
        company: "Kestrel Industrial Systems",
        contact: "Marcus Oyelaran",
        email: "m.oyelaran@kestrelindustrial.com",
        phone: "+1 (313) 555-0164",
        industry: "Manufacturing",
        status: "prospect",
        lastContact: "2026-09-18",
        jobTitle: "Director of IT",
        address: "789 Industrial Blvd, Detroit, MI 48201",
        revenue: "$15,000,000",
        employees: 500,
        notes: "Large manufacturer looking to modernize its IT infrastructure."
    },
    {
        id: 4,
        company: "Marlow Health Partners",
        contact: "Dr. Elena Vasquez",
        email: "e.vasquez@marlowhealth.com",
        phone: "+1 (617) 555-0129",
        industry: "Healthcare",
        status: "active",
        lastContact: "2026-09-26",
        jobTitle: "Chief Medical Officer",
        address: "321 Medical Center Dr, Boston, MA 02101",
        revenue: "$8,500,000",
        employees: 200,
        notes: "Healthcare provider interested in patient management systems."
    },
    {
        id: 5,
        company: "Pinnacle Ledger Group",
        contact: "Robert Eriksson",
        email: "r.eriksson@pinnacleledger.com",
        phone: "+1 (212) 555-0176",
        industry: "Finance",
        status: "inactive",
        lastContact: "2026-05-14",
        jobTitle: "CFO",
        address: "987 Wall Street, New York, NY 10005",
        revenue: "$25,000,000",
        employees: 300,
        notes: "Previous client. Contract expired in April. Good relationship maintained."
    },
    {
        id: 6,
        company: "Lumen Analytics",
        contact: "Wen Zhao",
        email: "w.zhao@lumenanalytics.com",
        phone: "+1 (206) 555-0153",
        industry: "Technology",
        status: "active",
        lastContact: "2026-09-30",
        jobTitle: "CEO",
        address: "890 Innovation Way, Seattle, WA 98101",
        revenue: "$3,200,000",
        employees: 75,
        notes: "Analytics startup looking for enterprise integration tools."
    },
    {
        id: 7,
        company: "Ridgeline Construction",
        contact: "Diego Santana",
        email: "d.santana@ridgelineconstruction.com",
        phone: "+1 (602) 555-0118",
        industry: "Construction",
        status: "prospect",
        lastContact: "2026-09-12",
        jobTitle: "Project Manager",
        address: "567 Builder Ave, Phoenix, AZ 85001",
        revenue: "$12,000,000",
        employees: 250,
        notes: "Construction firm interested in project management software."
    },
    {
        id: 8,
        company: "Calder Valley College",
        contact: "Professor Adaeze Eze",
        email: "a.eze@caldervalley.edu",
        phone: "+1 (312) 555-0139",
        industry: "Education",
        status: "active",
        lastContact: "2026-09-21",
        jobTitle: "Academic Director",
        address: "432 Education Blvd, Chicago, IL 60601",
        revenue: "$2,800,000",
        employees: 120,
        notes: "Educational institution seeking student management systems."
    },
    {
        id: 9,
        company: "Solstice Renewables",
        contact: "Tobias Lindqvist",
        email: "t.lindqvist@solsticerenewables.com",
        phone: "+1 (303) 555-0192",
        industry: "Energy",
        status: "active",
        lastContact: "2026-09-19",
        jobTitle: "Operations Director",
        address: "123 Solar St, Denver, CO 80201",
        revenue: "$18,500,000",
        employees: 400,
        notes: "Renewable energy company expanding its digital infrastructure."
    },
    {
        id: 10,
        company: "Bellmont Retail Group",
        contact: "Priyanka Nair",
        email: "p.nair@bellmontretail.com",
        phone: "+1 (404) 555-0145",
        industry: "Retail",
        status: "prospect",
        lastContact: "2026-09-14",
        jobTitle: "IT Director",
        address: "789 Commerce Dr, Atlanta, GA 30301",
        revenue: "$45,000,000",
        employees: 1200,
        notes: "Retail chain considering an e-commerce platform upgrade."
    },
    {
        id: 11,
        company: "Verity Biosciences",
        contact: "Dr. Kenji Watanabe",
        email: "k.watanabe@veritybio.com",
        phone: "+1 (619) 555-0171",
        industry: "Biotechnology",
        status: "active",
        lastContact: "2026-09-30",
        jobTitle: "Research Director",
        address: "456 Science Park, San Diego, CA 92101",
        revenue: "$7,300,000",
        employees: 180,
        notes: "Biotech company needing lab management systems."
    },
    {
        id: 12,
        company: "Northgate Freight",
        contact: "Lucia Fernandez",
        email: "l.fernandez@northgatefreight.com",
        phone: "+1 (214) 555-0134",
        industry: "Transportation",
        status: "inactive",
        lastContact: "2026-04-22",
        jobTitle: "Fleet Manager",
        address: "321 Transport Way, Dallas, TX 75201",
        revenue: "$22,000,000",
        employees: 800,
        notes: "Logistics company with an expired contract. Potential for renewal."
    },
    {
        id: 13,
        company: "Copperleaf Media",
        contact: "Min-jun Park",
        email: "m.park@copperleafmedia.com",
        phone: "+1 (323) 555-0188",
        industry: "Marketing",
        status: "active",
        lastContact: "2026-09-25",
        jobTitle: "Creative Director",
        address: "654 Marketing Blvd, Los Angeles, CA 90210",
        revenue: "$4,100,000",
        employees: 95,
        notes: "Marketing agency interested in client management tools."
    },
    {
        id: 14,
        company: "Elmwood Care Network",
        contact: "Dr. Naledi Dlamini",
        email: "n.dlamini@elmwoodcare.com",
        phone: "+1 (305) 555-0126",
        industry: "Healthcare",
        status: "prospect",
        lastContact: "2026-09-16",
        jobTitle: "Chief Information Officer",
        address: "987 Health Ave, Miami, FL 33101",
        revenue: "$31,000,000",
        employees: 750,
        notes: "Healthcare provider evaluating EMR systems."
    },
    {
        id: 15,
        company: "Hearthstone Smart Living",
        contact: "Callum MacLeod",
        email: "c.macleod@hearthstonesmart.com",
        phone: "+1 (503) 555-0163",
        industry: "Technology",
        status: "active",
        lastContact: "2026-09-29",
        jobTitle: "Product Manager",
        address: "159 Innovation Dr, Portland, OR 97201",
        revenue: "$6,800,000",
        employees: 140,
        notes: "IoT company developing smart home solutions."
    },
    {
        id: 16,
        company: "Alder Capital Partners",
        contact: "Sebastian Koch",
        email: "s.koch@aldercapital.com",
        phone: "+1 (212) 555-0197",
        industry: "Finance",
        status: "active",
        lastContact: "2026-09-23",
        jobTitle: "Investment Manager",
        address: "753 Financial St, New York, NY 10004",
        revenue: "$89,000,000",
        employees: 420,
        notes: "Investment firm requiring portfolio management tools."
    },
    {
        id: 17,
        company: "Fallowfield Agri",
        contact: "Greta Johansson",
        email: "g.johansson@fallowfieldagri.com",
        phone: "+1 (515) 555-0121",
        industry: "Agriculture",
        status: "prospect",
        lastContact: "2026-09-10",
        jobTitle: "Farm Operations Manager",
        address: "852 Rural Route, Des Moines, IA 50301",
        revenue: "$9,500,000",
        employees: 230,
        notes: "Agricultural technology company exploring farm management software."
    },
    {
        id: 18,
        company: "Stratus Cloud Services",
        contact: "Rohan Kapoor",
        email: "r.kapoor@stratuscloud.com",
        phone: "+1 (512) 555-0159",
        industry: "Technology",
        status: "active",
        lastContact: "2026-09-27",
        jobTitle: "Solutions Architect",
        address: "741 Cloud Ave, Austin, TX 78702",
        revenue: "$14,200,000",
        employees: 320,
        notes: "Cloud services provider interested in infrastructure monitoring."
    },
    {
        id: 19,
        company: "Maison Verde Apparel",
        contact: "Ines Beaumont",
        email: "i.beaumont@maisonverde.com",
        phone: "+1 (323) 555-0112",
        industry: "Fashion",
        status: "inactive",
        lastContact: "2026-03-18",
        jobTitle: "Brand Manager",
        address: "963 Style St, Los Angeles, CA 90028",
        revenue: "$12,800,000",
        employees: 280,
        notes: "Fashion retailer with a lapsed subscription. Strong brand recognition."
    },
    {
        id: 20,
        company: "Tarn & Ridley Consulting",
        contact: "Kofi Asante",
        email: "k.asante@tarnridley.com",
        phone: "+1 (202) 555-0148",
        industry: "Consulting",
        status: "active",
        lastContact: "2026-09-30",
        jobTitle: "Senior Consultant",
        address: "258 Consulting Way, Washington, DC 20001",
        revenue: "$8,900,000",
        employees: 165,
        notes: "IT consulting firm providing services to government agencies."
    },
    {
        id: 21,
        company: "Larder & Co Foodservice",
        contact: "Beatrix Novak",
        email: "b.novak@larderandco.com",
        phone: "+1 (504) 555-0183",
        industry: "Food Service",
        status: "prospect",
        lastContact: "2026-09-15",
        jobTitle: "Operations Coordinator",
        address: "147 Culinary Blvd, New Orleans, LA 70112",
        revenue: "$16,700,000",
        employees: 650,
        notes: "Restaurant chain exploring POS and inventory management systems."
    },
    {
        id: 22,
        company: "Ironbark Cyber",
        contact: "Tariq Rahman",
        email: "t.rahman@ironbarkcyber.com",
        phone: "+1 (703) 555-0136",
        industry: "Cybersecurity",
        status: "active",
        lastContact: "2026-09-22",
        jobTitle: "Security Analyst",
        address: "369 Security Dr, Arlington, VA 22201",
        revenue: "$11,400,000",
        employees: 190,
        notes: "Cybersecurity firm specializing in enterprise threat detection."
    },
    {
        id: 23,
        company: "Greenfield Environmental",
        contact: "Mirela Popescu",
        email: "m.popescu@greenfieldenv.com",
        phone: "+1 (503) 555-0174",
        industry: "Environmental",
        status: "active",
        lastContact: "2026-09-20",
        jobTitle: "Environmental Director",
        address: "741 Green Way, Portland, OR 97205",
        revenue: "$5,600,000",
        employees: 110,
        notes: "Environmental consulting firm focused on sustainability solutions."
    },
    {
        id: 24,
        company: "Parkside Property Group",
        contact: "Oskar Lindgren",
        email: "o.lindgren@parksidepg.com",
        phone: "+1 (702) 555-0152",
        industry: "Real Estate",
        status: "prospect",
        lastContact: "2026-09-08",
        jobTitle: "Property Manager",
        address: "852 Property Ave, Las Vegas, NV 89101",
        revenue: "$28,300,000",
        employees: 520,
        notes: "Commercial real estate firm interested in property management software."
    },
    {
        id: 25,
        company: "Torque Automotive Systems",
        contact: "Shirin Moradi",
        email: "s.moradi@torqueautomotive.com",
        phone: "+1 (313) 555-0107",
        industry: "Automotive",
        status: "active",
        lastContact: "2026-09-29",
        jobTitle: "Technical Lead",
        address: "159 Motor Way, Detroit, MI 48226",
        revenue: "$19,800,000",
        employees: 380,
        notes: "Automotive technology company developing connected car solutions."
    },
    {
        id: 26,
        company: "Hartwell & Associates LLP",
        contact: "Emmanuel Okonkwo",
        email: "e.okonkwo@hartwelllaw.com",
        phone: "+1 (312) 555-0191",
        industry: "Legal",
        status: "inactive",
        lastContact: "2026-02-26",
        jobTitle: "Managing Partner",
        address: "753 Justice Blvd, Chicago, IL 60604",
        revenue: "$7,200,000",
        employees: 85,
        notes: "Law firm with an expired case management software license."
    },
    {
        id: 27,
        company: "Fieldhouse Analytics",
        contact: "Valentina Rossi",
        email: "v.rossi@fieldhouseanalytics.com",
        phone: "+1 (407) 555-0168",
        industry: "Sports",
        status: "active",
        lastContact: "2026-09-21",
        jobTitle: "Data Scientist",
        address: "486 Athletic Ave, Orlando, FL 32801",
        revenue: "$3,900,000",
        employees: 65,
        notes: "Sports analytics company providing insights to professional teams."
    },
    {
        id: 28,
        company: "Harbor Lane Audio",
        contact: "Kaito Nakamura",
        email: "k.nakamura@harborlaneaudio.com",
        phone: "+1 (615) 555-0144",
        industry: "Entertainment",
        status: "prospect",
        lastContact: "2026-09-07",
        jobTitle: "Platform Engineer",
        address: "372 Music Row, Nashville, TN 37203",
        revenue: "$24,600,000",
        employees: 460,
        notes: "Audio streaming platform evaluating content management systems."
    },
    {
        id: 29,
        company: "Meridian Journeys",
        contact: "Ximena Castillo",
        email: "x.castillo@meridianjourneys.com",
        phone: "+1 (305) 555-0159",
        industry: "Travel",
        status: "active",
        lastContact: "2026-09-17",
        jobTitle: "Travel Coordinator",
        address: "691 Adventure Blvd, Miami, FL 33126",
        revenue: "$13,500,000",
        employees: 240,
        notes: "Travel agency specializing in corporate and adventure travel packages."
    },
    {
        id: 30,
        company: "Quillon Research Labs",
        contact: "Dr. Ravi Subramanian",
        email: "r.subramanian@quillonlabs.com",
        phone: "+1 (617) 555-0186",
        industry: "Research",
        status: "active",
        lastContact: "2026-09-30",
        jobTitle: "Principal Researcher",
        address: "128 Quantum St, Cambridge, MA 02139",
        revenue: "$4,700,000",
        employees: 55,
        notes: "Research lab requiring specialized data analysis tools."
    }
];

let opportunities = [
    {
        id: 1,
        company: "Harlow Dynamics",
        title: "Enterprise software license",
        value: "$125,000",
        stage: "proposal",
        probability: "75%",
        closeDate: "2026-11-13"
    },
    {
        id: 2,
        company: "Brightwater Software",
        title: "Cloud migration services",
        value: "$85,000",
        stage: "qualification",
        probability: "60%",
        closeDate: "2026-12-04"
    },
    {
        id: 3,
        company: "Kestrel Industrial Systems",
        title: "IT infrastructure upgrade",
        value: "$350,000",
        stage: "prospecting",
        probability: "25%",
        closeDate: "2026-12-18"
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
        document.title = `${tabButton.textContent.trim()} | CRM | Westbrook Industries`;
    }
}

// Status badge tones (status colours are used for status only)
const statusTone = { active: 'tone-success', inactive: 'tone-neutral', prospect: 'tone-info' };

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
            <td><span class="status-badge ${customer.status} ${statusTone[customer.status] || 'tone-neutral'}">${customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span></td>
            <td>${formatDate(customer.lastContact)}</td>
            <td class="row-actions">
                <button class="btn-secondary btn-small" onclick="editCustomer(${customer.id})">Edit</button>
                <button class="btn-secondary btn-small" onclick="viewCustomer(${customer.id})">View</button>
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
                <div class="opp-title">${opp.title}</div>
                <div class="opp-company">${opp.company}</div>
                <div class="opp-value num">${opp.value}</div>
                <div class="opp-close">Close: ${formatDate(opp.closeDate)}</div>
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
        alert(`Edit customer: ${customer.company}\n\nThis would open an edit form with the customer's current information.`);
    }
}

function viewCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        alert(`Customer details: ${customer.company}\n\nContact: ${customer.contact}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nIndustry: ${customer.industry}\nStatus: ${customer.status}\nRevenue: ${customer.revenue}\nEmployees: ${customer.employees}\n\nNotes: ${customer.notes}`);
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
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

console.log('CRM initialized');