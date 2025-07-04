// Human Resources Management System JavaScript

// Global variables
let employees = [];
let candidates = [];
let currentPage = 1;
const pageSize = 10;

// Sample data
const sampleEmployees = [
    {
        id: 'EMP001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@nexuscorp.com',
        phone: '+1 (555) 123-4567',
        department: 'engineering',
        position: 'Senior Software Engineer',
        hireDate: '2021-03-15',
        salary: 125000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.5
    },
    {
        id: 'EMP002',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@nexuscorp.com',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'Engineering Manager',
        hireDate: '2020-01-22',
        salary: 145000,
        status: 'active',
        location: 'san-francisco',
        manager: 'David Chen',
        performanceRating: 4.8
    },
    {
        id: 'EMP003',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@nexuscorp.com',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Sales Representative',
        hireDate: '2022-06-10',
        salary: 75000,
        status: 'active',
        location: 'new-york',
        manager: 'Jennifer Lee',
        performanceRating: 4.2
    },
    {
        id: 'EMP004',
        firstName: 'Emily',
        lastName: 'Chen',
        email: 'emily.chen@nexuscorp.com',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Marketing Specialist',
        hireDate: '2021-11-08',
        salary: 68000,
        status: 'active',
        location: 'chicago',
        manager: 'Robert Johnson',
        performanceRating: 4.3
    },
    {
        id: 'EMP005',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@nexuscorp.com',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'HR Business Partner',
        hireDate: '2019-09-30',
        salary: 82000,
        status: 'on-leave',
        location: 'remote',
        manager: 'Lisa Anderson',
        performanceRating: 4.6
    },
    {
        id: 'EMP006',
        firstName: 'Jessica',
        lastName: 'Brown',
        email: 'jessica.brown@nexuscorp.com',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Financial Analyst',
        hireDate: '2023-02-20',
        salary: 95000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.1
    },
    {
        id: 'EMP007',
        firstName: 'Chris',
        lastName: 'Green',
        email: 'chris.green@nexuscorp.com',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'Software Engineer',
        hireDate: '2023-05-12',
        salary: 110000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.0
    },
    {
        id: 'EMP008',
        firstName: 'Amanda',
        lastName: 'White',
        email: 'amanda.white@nexuscorp.com',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Account Executive',
        hireDate: '2022-10-01',
        salary: 85000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.4
    },
    {
        id: 'EMP009',
        firstName: 'James',
        lastName: 'Harris',
        email: 'james.harris@nexuscorp.com',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Content Strategist',
        hireDate: '2023-01-15',
        salary: 72000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.2
    },
    {
        id: 'EMP010',
        firstName: 'Linda',
        lastName: 'Martin',
        email: 'linda.martin@nexuscorp.com',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Recruiter',
        hireDate: '2022-08-20',
        salary: 78000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.3
    },
    {
        id: 'EMP011',
        firstName: 'Robert',
        lastName: 'Thompson',
        email: 'robert.thompson@nexuscorp.com',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'Senior Accountant',
        hireDate: '2021-07-11',
        salary: 105000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.6
    },
    {
        id: 'EMP012',
        firstName: 'Patricia',
        lastName: 'Garcia',
        email: 'patricia.garcia@nexuscorp.com',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'QA Tester',
        hireDate: '2023-08-01',
        salary: 90000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 3.9
    },
    {
        id: 'EMP013',
        firstName: 'Michael',
        lastName: 'Martinez',
        email: 'michael.martinez@nexuscorp.com',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Sales Development Representative',
        hireDate: '2023-03-10',
        salary: 65000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.0
    },
    {
        id: 'EMP014',
        firstName: 'Barbara',
        lastName: 'Rodriguez',
        email: 'barbara.rodriguez@nexuscorp.com',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'SEO Specialist',
        hireDate: '2022-12-05',
        salary: 69000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.1
    },
    {
        id: 'EMP015',
        firstName: 'William',
        lastName: 'Lopez',
        email: 'william.lopez@nexuscorp.com',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'HR Generalist',
        hireDate: '2021-05-25',
        salary: 75000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.4
    },
    {
        id: 'EMP016',
        firstName: 'Elizabeth',
        lastName: 'Perez',
        email: 'elizabeth.perez@nexuscorp.com',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Accountant',
        hireDate: '2023-06-15',
        salary: 88000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.0
    },
    {
        id: 'EMP017',
        firstName: 'Richard',
        lastName: 'Williams',
        email: 'richard.williams@nexuscorp.com',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'DevOps Engineer',
        hireDate: '2022-04-18',
        salary: 115000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.7
    },
    {
        id: 'EMP018',
        firstName: 'Susan',
        lastName: 'Jones',
        email: 'susan.jones@nexuscorp.com',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Key Account Manager',
        hireDate: '2021-09-01',
        salary: 95000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.8
    },
    {
        id: 'EMP019',
        firstName: 'Joseph',
        lastName: 'Miller',
        email: 'joseph.miller@nexuscorp.com',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Social Media Manager',
        hireDate: '2023-04-01',
        salary: 71000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.3
    },
    {
        id: 'EMP020',
        firstName: 'Margaret',
        lastName: 'Taylor',
        email: 'margaret.taylor@nexuscorp.com',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Compensation Analyst',
        hireDate: '2022-02-10',
        salary: 81000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.2
    },
    {
        id: 'EMP021',
        firstName: 'Charles',
        lastName: 'Anderson',
        email: 'charles.anderson@nexuscorp.com',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'Controller',
        hireDate: '2020-11-15',
        salary: 130000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.9
    },
    {
        id: 'EMP022',
        firstName: 'Mary',
        lastName: 'Thomas',
        email: 'mary.thomas@nexuscorp.com',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'UI/UX Designer',
        hireDate: '2023-09-01',
        salary: 98000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.1
    },
    {
        id: 'EMP023',
        firstName: 'Daniel',
        lastName: 'Jackson',
        email: 'daniel.jackson@nexuscorp.com',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Sales Manager',
        hireDate: '2021-02-20',
        salary: 110000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.7
    },
    {
        id: 'EMP024',
        firstName: 'Karen',
        lastName: 'White',
        email: 'karen.white@nexuscorp.com',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Product Marketing Manager',
        hireDate: '2022-07-18',
        salary: 78000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.5
    },
    {
        id: 'EMP025',
        firstName: 'Paul',
        lastName: 'Harris',
        email: 'paul.harris@nexuscorp.com',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'HR Manager',
        hireDate: '2020-03-10',
        salary: 95000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.8
    },
    {
        id: 'EMP026',
        firstName: 'Nancy',
        lastName: 'Clark',
        email: 'nancy.clark@nexuscorp.com',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Financial Planner',
        hireDate: '2023-10-01',
        salary: 92000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.2
    },
    {
        id: 'EMP027',
        firstName: 'Mark',
        lastName: 'Lewis',
        email: 'mark.lewis@nexuscorp.com',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'Embedded Systems Engineer',
        hireDate: '2022-09-12',
        salary: 120000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.6
    },
    {
        id: 'EMP028',
        firstName: 'Betty',
        lastName: 'Robinson',
        email: 'betty.robinson@nexuscorp.com',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Channel Sales Manager',
        hireDate: '2021-12-01',
        salary: 105000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.9
    },
    {
        id: 'EMP029',
        firstName: 'George',
        lastName: 'Walker',
        email: 'george.walker@nexuscorp.com',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Graphic Designer',
        hireDate: '2023-07-01',
        salary: 74000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.4
    },
    {
        id: 'EMP030',
        firstName: 'Sandra',
        lastName: 'Hall',
        email: 'sandra.hall@nexuscorp.com',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Benefits Coordinator',
        hireDate: '2022-06-20',
        salary: 79000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.3
    },
    {
        id: 'EMP031',
        firstName: 'Steven',
        lastName: 'Allen',
        email: 'steven.allen@nexuscorp.com',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'Auditor',
        hireDate: '2021-01-15',
        salary: 98000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.5
    },
    {
        id: 'EMP032',
        firstName: 'Donna',
        lastName: 'Young',
        email: 'donna.young@nexuscorp.com',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'Firmware Engineer',
        hireDate: '2023-11-01',
        salary: 112000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.0
    },
    {
        id: 'EMP033',
        firstName: 'Kenneth',
        lastName: 'King',
        email: 'kenneth.king@nexuscorp.com',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Sales Engineer',
        hireDate: '2022-01-10',
        salary: 100000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.8
    },
    {
        id: 'EMP034',
        firstName: 'Cynthia',
        lastName: 'Wright',
        email: 'cynthia.wright@nexuscorp.com',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Events Coordinator',
        hireDate: '2023-02-18',
        salary: 70000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.2
    },
    {
        id: 'EMP035',
        firstName: 'Ronald',
        lastName: 'Scott',
        email: 'ronald.scott@nexuscorp.com',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'HRIS Analyst',
        hireDate: '2021-08-25',
        salary: 83000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.6
    },
    {
        id: 'EMP036',
        firstName: 'Dorothy',
        lastName: 'Green',
        email: 'dorothy.green@nexuscorp.com',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Tax Specialist',
        hireDate: '2023-12-01',
        salary: 96000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.1
    },
    {
        id: 'EMP037',
        firstName: 'Brian',
        lastName: 'Adams',
        email: 'brian.adams@nexuscorp.com',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'Mobile App Developer',
        hireDate: '2022-06-18',
        salary: 118000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.7
    },
    {
        id: 'EMP038',
        firstName: 'Sharon',
        lastName: 'Baker',
        email: 'sharon.baker@nexuscorp.com',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Customer Success Manager',
        hireDate: '2021-03-01',
        salary: 92000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.9
    },
    {
        id: 'EMP039',
        firstName: 'Kevin',
        lastName: 'Nelson',
        email: 'kevin.nelson@nexuscorp.com',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Email Marketing Specialist',
        hireDate: '2023-05-01',
        salary: 73000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.3
    },
    {
        id: 'EMP040',
        firstName: 'Deborah',
        lastName: 'Carter',
        email: 'deborah.carter@nexuscorp.com',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Payroll Specialist',
        hireDate: '2022-04-10',
        salary: 80000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.4
    },
    {
        id: 'EMP041',
        firstName: 'Jason',
        lastName: 'Mitchell',
        email: 'jason.mitchell@nexuscorp.com',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'FP&A Analyst',
        hireDate: '2020-09-15',
        salary: 102000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.7
    },
    {
        id: 'EMP042',
        firstName: 'Michelle',
        lastName: 'Perez',
        email: 'michelle.perez@nexuscorp.com',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'Data Scientist',
        hireDate: '2023-12-15',
        salary: 128000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.2
    },
    {
        id: 'EMP043',
        firstName: 'Ryan',
        lastName: 'Roberts',
        email: 'ryan.roberts@nexuscorp.com',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Regional Sales Director',
        hireDate: '2020-08-20',
        salary: 135000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.9
    },
    {
        id: 'EMP044',
        firstName: 'Laura',
        lastName: 'Turner',
        email: 'laura.turner@nexuscorp.com',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Marketing Analyst',
        hireDate: '2022-10-18',
        salary: 76000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.6
    },
    {
        id: 'EMP045',
        firstName: 'Jeffrey',
        lastName: 'Phillips',
        email: 'jeffrey.phillips@nexuscorp.com',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'Talent Acquisition Specialist',
        hireDate: '2021-11-25',
        salary: 85000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.7
    },
    {
        id: 'EMP046',
        firstName: 'Kimberly',
        lastName: 'Campbell',
        email: 'kimberly.campbell@nexuscorp.com',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Procurement Specialist',
        hireDate: '2024-01-05',
        salary: 89000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.3
    },
    {
        id: 'EMP047',
        firstName: 'Gary',
        lastName: 'Parker',
        email: 'gary.parker@nexuscorp.com',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'Cloud Engineer',
        hireDate: '2022-08-18',
        salary: 122000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.8
    },
    {
        id: 'EMP048',
        firstName: 'Amy',
        lastName: 'Evans',
        email: 'amy.evans@nexuscorp.com',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Sales Operations Analyst',
        hireDate: '2021-06-01',
        salary: 90000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.7
    },
    {
        id: 'EMP049',
        firstName: 'Stephen',
        lastName: 'Edwards',
        email: 'stephen.edwards@nexuscorp.com',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Public Relations Specialist',
        hireDate: '2023-06-01',
        salary: 75000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.4
    },
    {
        id: 'EMP050',
        firstName: 'Angela',
        lastName: 'Collins',
        email: 'angela.collins@nexuscorp.com',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Employee Relations Specialist',
        hireDate: '2022-05-10',
        salary: 82000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.5
    },
    {
        id: 'EMP051',
        firstName: 'Frank',
        lastName: 'Stewart',
        email: 'frank.stewart@nexuscorp.com',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'Investor Relations',
        hireDate: '2020-02-15',
        salary: 110000,
        status: 'active',
        location: 'new-york',
        manager: 'Robert Johnson',
        performanceRating: 4.8
    },
    {
        id: 'EMP052',
        firstName: 'Brenda',
        lastName: 'Sanchez',
        email: 'brenda.sanchez@nexuscorp.com',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'Security Engineer',
        hireDate: '2024-02-01',
        salary: 130000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Sarah Wilson',
        performanceRating: 4.3
    },
    {
        id: 'EMP053',
        firstName: 'Larry',
        lastName: 'Morris',
        email: 'larry.morris@nexuscorp.com',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Business Development Manager',
        hireDate: '2021-04-20',
        salary: 115000,
        status: 'active',
        location: 'chicago',
        manager: 'Jennifer Lee',
        performanceRating: 4.9
    },
    {
        id: 'EMP054',
        firstName: 'Pamela',
        lastName: 'Rogers',
        email: 'pamela.rogers@nexuscorp.com',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Brand Manager',
        hireDate: '2022-11-18',
        salary: 80000,
        status: 'active',
        location: 'remote',
        manager: 'Robert Johnson',
        performanceRating: 4.7
    },
    {
        id: 'EMP055',
        firstName: 'Gregory',
        lastName: 'Reed',
        email: 'gregory.reed@nexuscorp.com',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'Training and Development Manager',
        hireDate: '2021-12-25',
        salary: 88000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Lisa Anderson',
        performanceRating: 4.8
    }
];

const sampleCandidates = [
    { name: 'Alex Johnson', position: 'Software Engineer', stage: 'applied', score: 85 },
    { name: 'Maria Garcia', position: 'Product Manager', stage: 'screening', score: 92 },
    { name: 'James Wilson', position: 'Data Scientist', stage: 'interview', score: 88 },
    { name: 'Lisa Chen', position: 'UX Designer', stage: 'offer', score: 94 },
    { name: 'Robert Kim', position: 'DevOps Engineer', stage: 'hired', score: 90 }
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
    router.addRoute('employees', () => switchTab('employees'));
    router.addRoute('recruitment', () => switchTab('recruitment'));
    router.addRoute('performance', () => switchTab('performance'));
    router.addRoute('payroll', () => switchTab('payroll'));
    router.addRoute('benefits', () => switchTab('benefits'));
    router.addRoute('reports', () => switchTab('reports'));
    
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
        document.title = `${navItem.textContent.trim()} - Human Resources - Nexus Corp`;
    }
    
    loadTabContent(tabName);
}

function loadTabContent(tabName) {
    setTimeout(() => {
        switch(tabName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'employees':
                loadEmployees();
                break;
            case 'recruitment':
                loadRecruitment();
                break;
            case 'performance':
                loadPerformance();
                break;
            case 'payroll':
                loadPayroll();
                break;
            case 'benefits':
                loadBenefits();
                break;
            case 'reports':
                loadReports();
                break;
        }
    }, 100);
}

function loadSampleData() {
    employees = [...sampleEmployees];
    candidates = [...sampleCandidates];
}

function setupEventListeners() {
    // Employee form submission
    const employeeForm = document.getElementById('employee-form');
    if (employeeForm) {
        employeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createNewEmployee();
        });
    }
    
    // Filter listeners
    const filters = ['dept-filter', 'status-filter', 'location-filter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', applyEmployeeFilters);
        }
    });
    
    // Search listener
    const searchInput = document.getElementById('employee-search');
    if (searchInput) {
        searchInput.addEventListener('input', applyEmployeeFilters);
    }
}

// Dashboard functions
function loadDashboard() {
    loadRecentHires();
    loadUpcomingReviews();
    createDepartmentChart();
    createAttendanceChart();
}

function loadRecentHires() {
    const container = document.getElementById('recent-hires');
    if (!container) return;
    
    container.innerHTML = '';
    const recentHires = employees
        .sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate))
        .slice(0, 5);
    
    recentHires.forEach(employee => {
        const hireElement = document.createElement('div');
        hireElement.className = 'hire-item';
        hireElement.innerHTML = `
            <div class="employee-avatar">${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}</div>
            <div class="employee-info">
                <div class="employee-name">${employee.firstName} ${employee.lastName}</div>
                <div class="employee-details">${employee.position} • ${formatDate(employee.hireDate)}</div>
            </div>
        `;
        container.appendChild(hireElement);
    });
}

function loadUpcomingReviews() {
    const container = document.getElementById('upcoming-reviews');
    if (!container) return;
    
    const upcomingReviews = [
        { name: 'John Smith', date: '2024-01-20', type: 'Annual Review' },
        { name: 'Sarah Wilson', date: '2024-01-22', type: 'Quarterly Check-in' },
        { name: 'Mike Davis', date: '2024-01-25', type: '90-Day Review' }
    ];
    
    container.innerHTML = '';
    upcomingReviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.innerHTML = `
            <div class="employee-avatar">${review.name.split(' ').map(n => n.charAt(0)).join('')}</div>
            <div class="employee-info">
                <div class="employee-name">${review.name}</div>
                <div class="employee-details">${review.type} • ${review.date}</div>
            </div>
        `;
        container.appendChild(reviewElement);
    });
}

function createDepartmentChart() {
    const canvas = document.getElementById('department-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;
    
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
    const counts = [45, 32, 28, 15, 22];
    const colors = ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6'];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
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

function createAttendanceChart() {
    const canvas = document.getElementById('attendance-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const attendance = [94, 96, 93, 97, 89];
    
    const chartWidth = canvas.width - 60;
    const chartHeight = canvas.height - 60;
    const maxAttendance = 100;
    
    ctx.fillStyle = '#27ae60';
    attendance.forEach((rate, index) => {
        const barWidth = chartWidth / attendance.length - 10;
        const barHeight = (rate / maxAttendance) * chartHeight;
        const x = 30 + index * (chartWidth / attendance.length);
        const y = chartHeight - barHeight + 30;
        
        ctx.fillRect(x, y, barWidth, barHeight);
    });
}

// Employee management functions
function loadEmployees() {
    renderEmployeesTable();
    setupEmployeePagination();
}

function renderEmployeesTable() {
    const tbody = document.getElementById('employees-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEmployees = getFilteredEmployees().slice(startIndex, endIndex);
    
    paginatedEmployees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="employee-avatar">${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}</div>
            </td>
            <td>${employee.firstName} ${employee.lastName}</td>
            <td>${employee.id}</td>
            <td>${capitalizeFirst(employee.department)}</td>
            <td>${employee.position}</td>
            <td>${formatDate(employee.hireDate)}</td>
            <td><span class="status-badge ${employee.status}">${employee.status.replace('-', ' ')}</span></td>
            <td>$${employee.salary.toLocaleString()}</td>
            <td>
                <button class="action-btn" onclick="editEmployee('${employee.id}')">Edit</button>
                <button class="action-btn secondary" onclick="viewEmployee('${employee.id}')">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getFilteredEmployees() {
    let filtered = [...employees];
    
    const deptFilter = document.getElementById('dept-filter')?.value;
    const statusFilter = document.getElementById('status-filter')?.value;
    const locationFilter = document.getElementById('location-filter')?.value;
    const searchTerm = document.getElementById('employee-search')?.value.toLowerCase();
    
    if (deptFilter) {
        filtered = filtered.filter(emp => emp.department === deptFilter);
    }
    
    if (statusFilter) {
        filtered = filtered.filter(emp => emp.status === statusFilter);
    }
    
    if (locationFilter) {
        filtered = filtered.filter(emp => emp.location === locationFilter);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(emp => 
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm) ||
            emp.id.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

function applyEmployeeFilters() {
    currentPage = 1;
    renderEmployeesTable();
    setupEmployeePagination();
}

function setupEmployeePagination() {
    const filteredEmployees = getFilteredEmployees();
    const totalPages = Math.ceil(filteredEmployees.length / pageSize);
    const paginationContainer = document.getElementById('employees-pagination');
    
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.addEventListener('click', () => {
            currentPage = i;
            renderEmployeesTable();
            setupEmployeePagination();
        });
        paginationContainer.appendChild(button);
    }
}

// Recruitment functions
function loadRecruitment() {
    loadCandidatePipeline();
    loadJobPostings();
}

function loadCandidatePipeline() {
    const stages = ['applied', 'screening', 'interview', 'offer', 'hired'];
    
    stages.forEach(stage => {
        const container = document.getElementById(`${stage}-candidates`);
        if (!container) return;
        
        container.innerHTML = '';
        const stageCandidates = candidates.filter(c => c.stage === stage);
        
        stageCandidates.forEach(candidate => {
            const candidateElement = document.createElement('div');
            candidateElement.className = 'candidate-card';
            candidateElement.innerHTML = `
                <div class="candidate-name">${candidate.name}</div>
                <div class="candidate-position">${candidate.position}</div>
                <div style="margin-top: 10px; font-size: 0.8em; color: #27ae60;">Score: ${candidate.score}%</div>
            `;
            container.appendChild(candidateElement);
        });
    });
}

function loadJobPostings() {
    const container = document.getElementById('job-postings');
    if (!container) return;
    
    const jobPostings = [
        { title: 'Senior Software Engineer', applicants: 25, status: 'Active' },
        { title: 'Product Manager', applicants: 18, status: 'Active' },
        { title: 'UX Designer', applicants: 32, status: 'Active' },
        { title: 'Data Scientist', applicants: 14, status: 'Draft' }
    ];
    
    container.innerHTML = '';
    jobPostings.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.style.cssText = 'background: white; padding: 20px; margin-bottom: 15px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);';
        jobElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #2c3e50; margin-bottom: 5px;">${job.title}</h4>
                    <div style="color: #7f8c8d; font-size: 0.9em;">${job.applicants} applicants</div>
                </div>
                <span class="status-badge ${job.status.toLowerCase()}">${job.status}</span>
            </div>
        `;
        container.appendChild(jobElement);
    });
}

// Performance functions
function loadPerformance() {
    loadTopPerformers();
    loadGoalsChart();
    loadFeedbackStats();
}

function loadTopPerformers() {
    const container = document.getElementById('top-performers');
    if (!container) return;
    
    const topPerformers = employees
        .sort((a, b) => b.performanceRating - a.performanceRating)
        .slice(0, 5);
    
    container.innerHTML = '';
    topPerformers.forEach((performer, index) => {
        const performerElement = document.createElement('div');
        performerElement.style.cssText = 'display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #f1f2f6;';
        performerElement.innerHTML = `
            <div style="font-weight: 600; color: #27ae60; font-size: 1.2em;">#${index + 1}</div>
            <div class="employee-avatar">${performer.firstName.charAt(0)}${performer.lastName.charAt(0)}</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: #2c3e50;">${performer.firstName} ${performer.lastName}</div>
                <div style="color: #7f8c8d; font-size: 0.9em;">${performer.position}</div>
            </div>
            <div style="font-weight: 600; color: #27ae60;">${performer.performanceRating}/5</div>
        `;
        container.appendChild(performerElement);
    });
}

function loadGoalsChart() {
    const canvas = document.getElementById('goals-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;
    
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const goalsMet = [78, 82, 75, 84];
    
    const chartWidth = canvas.width - 60;
    const chartHeight = canvas.height - 60;
    
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    goalsMet.forEach((percentage, index) => {
        const x = 30 + (index * (chartWidth / (goalsMet.length - 1)));
        const y = 30 + (chartHeight - (percentage / 100) * chartHeight);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.stroke();
}

function loadFeedbackStats() {
    const container = document.getElementById('feedback-stats');
    if (!container) return;
    
    const feedbackData = [
        { category: 'Communication', average: 4.2 },
        { category: 'Leadership', average: 3.8 },
        { category: 'Technical Skills', average: 4.5 },
        { category: 'Teamwork', average: 4.1 }
    ];
    
    container.innerHTML = '';
    feedbackData.forEach(item => {
        const statElement = document.createElement('div');
        statElement.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f2f6;';
        statElement.innerHTML = `
            <span style="color: #2c3e50; font-weight: 500;">${item.category}</span>
            <span style="color: #27ae60; font-weight: 600;">${item.average}/5</span>
        `;
        container.appendChild(statElement);
    });
}

// Payroll functions
function loadPayroll() {
    createPayrollChart();
    loadSalaryBands();
    loadPayrollCalendar();
}

function createPayrollChart() {
    const canvas = document.getElementById('payroll-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;
    
    const categories = ['Salaries', 'Benefits', 'Taxes', 'Other'];
    const amounts = [1200000, 234120, 392450, 89760];
    const colors = ['#3498db', '#27ae60', '#e74c3c', '#f39c12'];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    let startAngle = 0;
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    
    amounts.forEach((amount, index) => {
        const sliceAngle = (amount / total) * 2 * Math.PI;
        
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        startAngle += sliceAngle;
    });
}

function loadSalaryBands() {
    const container = document.getElementById('salary-bands');
    if (!container) return;
    
    const salaryBands = [
        { department: 'Engineering', min: 80000, max: 180000, avg: 125000 },
        { department: 'Sales', min: 50000, max: 120000, avg: 75000 },
        { department: 'Marketing', min: 55000, max: 95000, avg: 68000 },
        { department: 'HR', min: 60000, max: 110000, avg: 82000 },
        { department: 'Finance', min: 65000, max: 130000, avg: 89000 }
    ];
    
    container.innerHTML = '';
    salaryBands.forEach(band => {
        const bandElement = document.createElement('div');
        bandElement.style.cssText = 'background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px;';
        bandElement.innerHTML = `
            <div style="font-weight: 600; color: #2c3e50; margin-bottom: 10px;">${band.department}</div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: #7f8c8d;">
                <span>Min: $${band.min.toLocaleString()}</span>
                <span>Avg: $${band.avg.toLocaleString()}</span>
                <span>Max: $${band.max.toLocaleString()}</span>
            </div>
        `;
        container.appendChild(bandElement);
    });
}

function loadPayrollCalendar() {
    const container = document.getElementById('payroll-calendar');
    if (!container) return;
    
    const payrollEvents = [
        { date: '2024-01-15', event: 'Bi-weekly Payroll', type: 'payroll' },
        { date: '2024-01-31', event: 'Monthly Benefits', type: 'benefits' },
        { date: '2024-02-01', event: 'Tax Filing Due', type: 'tax' },
        { date: '2024-02-15', event: 'Bi-weekly Payroll', type: 'payroll' }
    ];
    
    container.innerHTML = '';
    payrollEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.style.cssText = 'padding: 10px 0; border-bottom: 1px solid #f1f2f6; display: flex; justify-content: space-between;';
        eventElement.innerHTML = `
            <span style="color: #2c3e50; font-weight: 500;">${event.event}</span>
            <span style="color: #7f8c8d; font-size: 0.9em;">${event.date}</span>
        `;
        container.appendChild(eventElement);
    });
}

// Benefits functions
function loadBenefits() {
    loadHealthPlans();
    loadRetirementPlans();
    loadAdditionalBenefits();
}

function loadHealthPlans() {
    const container = document.getElementById('health-plans');
    if (!container) return;
    
    const healthPlans = [
        { name: 'Premium Health Plan', enrollment: '89%', cost: '$450/month' },
        { name: 'Basic Health Plan', enrollment: '11%', cost: '$200/month' }
    ];
    
    container.innerHTML = '';
    healthPlans.forEach(plan => {
        const planElement = document.createElement('div');
        planElement.className = 'plan-item';
        planElement.innerHTML = `
            <div class="plan-name">${plan.name}</div>
            <div class="plan-details">Enrollment: ${plan.enrollment} • Cost: ${plan.cost}</div>
        `;
        container.appendChild(planElement);
    });
}

function loadRetirementPlans() {
    const container = document.getElementById('retirement-plans');
    if (!container) return;
    
    const retirementPlans = [
        { name: '401(k) Plan', enrollment: '65%', match: '4% company match' },
        { name: 'Roth IRA Option', enrollment: '23%', match: 'No match' }
    ];
    
    container.innerHTML = '';
    retirementPlans.forEach(plan => {
        const planElement = document.createElement('div');
        planElement.className = 'plan-item';
        planElement.innerHTML = `
            <div class="plan-name">${plan.name}</div>
            <div class="plan-details">Enrollment: ${plan.enrollment} • ${plan.match}</div>
        `;
        container.appendChild(planElement);
    });
}

function loadAdditionalBenefits() {
    const container = document.getElementById('additional-benefits');
    if (!container) return;
    
    const additionalBenefits = [
        { name: 'Dental Insurance', enrollment: '76%', cost: '$25/month' },
        { name: 'Vision Insurance', enrollment: '82%', cost: '$15/month' },
        { name: 'Life Insurance', enrollment: '94%', cost: 'Company paid' },
        { name: 'Flexible Spending Account', enrollment: '45%', cost: 'Pre-tax' }
    ];
    
    container.innerHTML = '';
    additionalBenefits.forEach(benefit => {
        const benefitElement = document.createElement('div');
        benefitElement.className = 'plan-item';
        benefitElement.innerHTML = `
            <div class="plan-name">${benefit.name}</div>
            <div class="plan-details">Enrollment: ${benefit.enrollment} • Cost: ${benefit.cost}</div>
        `;
        container.appendChild(benefitElement);
    });
}

// Reports functions
function loadReports() {
    loadRecentReports();
}

function loadRecentReports() {
    const container = document.getElementById('recent-reports');
    if (!container) return;
    
    const recentReports = [
        { name: 'Monthly Headcount Report', date: '2024-01-15', type: 'PDF' },
        { name: 'Compensation Analysis', date: '2024-01-12', type: 'Excel' },
        { name: 'Performance Review Summary', date: '2024-01-10', type: 'PDF' },
        { name: 'Turnover Analysis', date: '2024-01-08', type: 'Excel' }
    ];
    
    container.innerHTML = '';
    recentReports.forEach(report => {
        const reportElement = document.createElement('div');
        reportElement.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #f1f2f6;';
        reportElement.innerHTML = `
            <div>
                <div style="font-weight: 600; color: #2c3e50;">${report.name}</div>
                <div style="color: #7f8c8d; font-size: 0.9em;">${report.date}</div>
            </div>
            <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: 600;">${report.type}</span>
        `;
        container.appendChild(reportElement);
    });
}

// Modal functions
function addEmployee() {
    document.getElementById('employee-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function createNewEmployee() {
    const formData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        position: document.getElementById('position').value,
        hireDate: document.getElementById('hire-date').value,
        salary: parseInt(document.getElementById('salary').value)
    };
    
    const newEmployee = {
        id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'active',
        location: 'san-francisco',
        manager: 'HR Manager',
        performanceRating: 0
    };
    
    employees.unshift(newEmployee);
    closeModal('employee-modal');
    document.getElementById('employee-form').reset();
    
    if (document.querySelector('[data-tab="employees"]').classList.contains('active')) {
        renderEmployeesTable();
        setupEmployeePagination();
    }
    
    alert('Employee added successfully!');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function editEmployee(empId) {
    alert(`Edit employee ${empId} functionality would be implemented here`);
}

function viewEmployee(empId) {
    alert(`View employee ${empId} functionality would be implemented here`);
}

function bulkImport() {
    alert('Bulk import functionality would be implemented here');
}

function exportEmployees() {
    alert('Export employees functionality would be implemented here');
}

function createJobPosting() {
    alert('Create job posting functionality would be implemented here');
}

function bulkActions() {
    alert('Bulk actions functionality would be implemented here');
}

function scheduleReview() {
    alert('Schedule review functionality would be implemented here');
}

function performanceReports() {
    alert('Performance reports functionality would be implemented here');
}

function processPayroll() {
    alert('Process payroll functionality would be implemented here');
}

function payrollReports() {
    alert('Payroll reports functionality would be implemented here');
}

function enrollEmployee() {
    alert('Enroll employee functionality would be implemented here');
}

function benefitsReports() {
    alert('Benefits reports functionality would be implemented here');
}

function generateReport() {
    alert('Generate report functionality would be implemented here');
}

function generateCustomReport() {
    alert('Generate custom report functionality would be implemented here');
}

function scheduleReport() {
    alert('Schedule report functionality would be implemented here');
}

function viewReport(reportType) {
    alert(`View ${reportType} report functionality would be implemented here`);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key >= '1' && e.key <= '7') {
            e.preventDefault();
            const tabs = ['dashboard', 'employees', 'recruitment', 'performance', 'payroll', 'benefits', 'reports'];
            const tabIndex = parseInt(e.key) - 1;
            if (tabs[tabIndex]) {
                router.navigate(`#${tabs[tabIndex]}`);
            }
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const activeTab = document.querySelector('.tab-content.active').id;
            if (activeTab === 'employees') {
                addEmployee();
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