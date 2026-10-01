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
        firstName: 'Rajesh',
        lastName: 'Iyer',
        email: 'rajesh.iyer@westbrook.example',
        phone: '+1 (555) 123-4567',
        department: 'engineering',
        position: 'Senior Software Engineer',
        hireDate: '2021-03-15',
        salary: 125000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.5
    },
    {
        id: 'EMP002',
        firstName: 'Kwame',
        lastName: 'Mensah',
        email: 'kwame.mensah@westbrook.example',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'Engineering Manager',
        hireDate: '2020-01-22',
        salary: 145000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Tomás Herrera',
        performanceRating: 4.8
    },
    {
        id: 'EMP003',
        firstName: 'Mateo',
        lastName: 'Alvarez',
        email: 'mateo.alvarez@westbrook.example',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Sales Representative',
        hireDate: '2022-06-10',
        salary: 75000,
        status: 'active',
        location: 'new-york',
        manager: 'Priya Raman',
        performanceRating: 4.2
    },
    {
        id: 'EMP004',
        firstName: 'Yuki',
        lastName: 'Tanaka',
        email: 'yuki.tanaka@westbrook.example',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Marketing Specialist',
        hireDate: '2021-11-08',
        salary: 68000,
        status: 'active',
        location: 'chicago',
        manager: 'Hannah Kowalski',
        performanceRating: 4.3
    },
    {
        id: 'EMP005',
        firstName: 'Fatima',
        lastName: 'Al-Sayed',
        email: 'fatima.alsayed@westbrook.example',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'HR Business Partner',
        hireDate: '2019-09-30',
        salary: 82000,
        status: 'on-leave',
        location: 'remote',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.6
    },
    {
        id: 'EMP006',
        firstName: 'Oliver',
        lastName: 'Grant',
        email: 'oliver.grant@westbrook.example',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Financial Analyst',
        hireDate: '2023-02-20',
        salary: 95000,
        status: 'active',
        location: 'new-york',
        manager: 'Ingrid Solheim',
        performanceRating: 4.1
    },
    {
        id: 'EMP007',
        firstName: 'Chiara',
        lastName: 'Romano',
        email: 'chiara.romano@westbrook.example',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'Software Engineer',
        hireDate: '2023-05-12',
        salary: 110000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.0
    },
    {
        id: 'EMP008',
        firstName: 'Nikhil',
        lastName: 'Desai',
        email: 'nikhil.desai@westbrook.example',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Account Executive',
        hireDate: '2022-10-01',
        salary: 85000,
        status: 'active',
        location: 'chicago',
        manager: 'Priya Raman',
        performanceRating: 4.4
    },
    {
        id: 'EMP009',
        firstName: 'Zainab',
        lastName: 'Bello',
        email: 'zainab.bello@westbrook.example',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Content Strategist',
        hireDate: '2023-01-15',
        salary: 72000,
        status: 'active',
        location: 'remote',
        manager: 'Hannah Kowalski',
        performanceRating: 4.2
    },
    {
        id: 'EMP010',
        firstName: 'Henrik',
        lastName: 'Larsen',
        email: 'henrik.larsen@westbrook.example',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Recruiter',
        hireDate: '2022-08-20',
        salary: 78000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.3
    },
    {
        id: 'EMP011',
        firstName: 'Elena',
        lastName: 'Petrova',
        email: 'elena.petrova@westbrook.example',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'Senior Accountant',
        hireDate: '2021-07-11',
        salary: 105000,
        status: 'active',
        location: 'new-york',
        manager: 'Ingrid Solheim',
        performanceRating: 4.6
    },
    {
        id: 'EMP012',
        firstName: 'Samuel',
        lastName: 'Adeyemi',
        email: 'samuel.adeyemi@westbrook.example',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'QA Tester',
        hireDate: '2025-08-01',
        salary: 90000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 3.9
    },
    {
        id: 'EMP013',
        firstName: 'Beatriz',
        lastName: 'Costa',
        email: 'beatriz.costa@westbrook.example',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Sales Development Representative',
        hireDate: '2023-03-10',
        salary: 65000,
        status: 'active',
        location: 'chicago',
        manager: 'Priya Raman',
        performanceRating: 4.0
    },
    {
        id: 'EMP014',
        firstName: 'Jonas',
        lastName: 'Weber',
        email: 'jonas.weber@westbrook.example',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'SEO Specialist',
        hireDate: '2022-12-05',
        salary: 69000,
        status: 'active',
        location: 'remote',
        manager: 'Hannah Kowalski',
        performanceRating: 4.1
    },
    {
        id: 'EMP015',
        firstName: 'Leila',
        lastName: 'Haddad',
        email: 'leila.haddad@westbrook.example',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'HR Generalist',
        hireDate: '2021-05-25',
        salary: 75000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.4
    },
    {
        id: 'EMP016',
        firstName: 'Valentina',
        lastName: 'Rojas',
        email: 'valentina.rojas@westbrook.example',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Accountant',
        hireDate: '2023-06-15',
        salary: 88000,
        status: 'active',
        location: 'new-york',
        manager: 'Ingrid Solheim',
        performanceRating: 4.0
    },
    {
        id: 'EMP017',
        firstName: 'Arjun',
        lastName: 'Menon',
        email: 'arjun.menon@westbrook.example',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'DevOps Engineer',
        hireDate: '2022-04-18',
        salary: 115000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.7
    },
    {
        id: 'EMP018',
        firstName: 'Grace',
        lastName: 'Nakamura',
        email: 'grace.nakamura@westbrook.example',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Key Account Manager',
        hireDate: '2021-09-01',
        salary: 95000,
        status: 'active',
        location: 'chicago',
        manager: 'Priya Raman',
        performanceRating: 4.8
    },
    {
        id: 'EMP019',
        firstName: 'Stefan',
        lastName: 'Novak',
        email: 'stefan.novak@westbrook.example',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Social Media Manager',
        hireDate: '2023-04-01',
        salary: 71000,
        status: 'active',
        location: 'remote',
        manager: 'Hannah Kowalski',
        performanceRating: 4.3
    },
    {
        id: 'EMP020',
        firstName: 'Aisha',
        lastName: 'Rahman',
        email: 'aisha.rahman@westbrook.example',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Compensation Analyst',
        hireDate: '2022-02-10',
        salary: 81000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.2
    },
    {
        id: 'EMP021',
        firstName: 'Ingrid',
        lastName: 'Solheim',
        email: 'ingrid.solheim@westbrook.example',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'Controller',
        hireDate: '2020-11-15',
        salary: 130000,
        status: 'active',
        location: 'new-york',
        manager: 'Tomás Herrera',
        performanceRating: 4.9
    },
    {
        id: 'EMP022',
        firstName: 'Tariq',
        lastName: 'Hassan',
        email: 'tariq.hassan@westbrook.example',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'UI/UX Designer',
        hireDate: '2025-09-01',
        salary: 98000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.1
    },
    {
        id: 'EMP023',
        firstName: 'Priya',
        lastName: 'Raman',
        email: 'priya.raman@westbrook.example',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Sales Manager',
        hireDate: '2021-02-20',
        salary: 110000,
        status: 'active',
        location: 'chicago',
        manager: 'Tomás Herrera',
        performanceRating: 4.7
    },
    {
        id: 'EMP024',
        firstName: 'Hannah',
        lastName: 'Kowalski',
        email: 'hannah.kowalski@westbrook.example',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Product Marketing Manager',
        hireDate: '2022-07-18',
        salary: 78000,
        status: 'active',
        location: 'remote',
        manager: 'Tomás Herrera',
        performanceRating: 4.5
    },
    {
        id: 'EMP025',
        firstName: 'Mei-Ling',
        lastName: 'Tan',
        email: 'mei-ling.tan@westbrook.example',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'HR Manager',
        hireDate: '2020-03-10',
        salary: 95000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Tomás Herrera',
        performanceRating: 4.8
    },
    {
        id: 'EMP026',
        firstName: 'Lars',
        lastName: 'Eriksson',
        email: 'lars.eriksson@westbrook.example',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Financial Planner',
        hireDate: '2026-01-12',
        salary: 92000,
        status: 'active',
        location: 'new-york',
        manager: 'Ingrid Solheim',
        performanceRating: 4.2
    },
    {
        id: 'EMP027',
        firstName: 'Ngozi',
        lastName: 'Eze',
        email: 'ngozi.eze@westbrook.example',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'Embedded Systems Engineer',
        hireDate: '2022-09-12',
        salary: 120000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.6
    },
    {
        id: 'EMP028',
        firstName: 'Mateus',
        lastName: 'Ferreira',
        email: 'mateus.ferreira@westbrook.example',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Channel Sales Manager',
        hireDate: '2021-12-01',
        salary: 105000,
        status: 'active',
        location: 'chicago',
        manager: 'Priya Raman',
        performanceRating: 4.9
    },
    {
        id: 'EMP029',
        firstName: 'Sung-min',
        lastName: 'Park',
        email: 'sung-min.park@westbrook.example',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Graphic Designer',
        hireDate: '2023-07-01',
        salary: 74000,
        status: 'active',
        location: 'remote',
        manager: 'Hannah Kowalski',
        performanceRating: 4.4
    },
    {
        id: 'EMP030',
        firstName: 'Camille',
        lastName: 'Dubois',
        email: 'camille.dubois@westbrook.example',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Benefits Coordinator',
        hireDate: '2022-06-20',
        salary: 79000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.3
    },
    {
        id: 'EMP031',
        firstName: 'Ravi',
        lastName: 'Choudhury',
        email: 'ravi.choudhury@westbrook.example',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'Auditor',
        hireDate: '2021-01-15',
        salary: 98000,
        status: 'active',
        location: 'new-york',
        manager: 'Ingrid Solheim',
        performanceRating: 4.5
    },
    {
        id: 'EMP032',
        firstName: 'Ayumi',
        lastName: 'Sato',
        email: 'ayumi.sato@westbrook.example',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'Firmware Engineer',
        hireDate: '2026-02-02',
        salary: 112000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.0
    },
    {
        id: 'EMP033',
        firstName: 'Dmitri',
        lastName: 'Volkov',
        email: 'dmitri.volkov@westbrook.example',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Sales Engineer',
        hireDate: '2022-01-10',
        salary: 100000,
        status: 'active',
        location: 'chicago',
        manager: 'Priya Raman',
        performanceRating: 4.8
    },
    {
        id: 'EMP034',
        firstName: 'Imani',
        lastName: 'Washington',
        email: 'imani.washington@westbrook.example',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Events Coordinator',
        hireDate: '2023-02-18',
        salary: 70000,
        status: 'active',
        location: 'remote',
        manager: 'Hannah Kowalski',
        performanceRating: 4.2
    },
    {
        id: 'EMP035',
        firstName: 'Emre',
        lastName: 'Yilmaz',
        email: 'emre.yilmaz@westbrook.example',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'HRIS Analyst',
        hireDate: '2021-08-25',
        salary: 83000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.6
    },
    {
        id: 'EMP036',
        firstName: 'Sana',
        lastName: 'Qureshi',
        email: 'sana.qureshi@westbrook.example',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Tax Specialist',
        hireDate: '2026-04-13',
        salary: 96000,
        status: 'active',
        location: 'new-york',
        manager: 'Ingrid Solheim',
        performanceRating: 4.1
    },
    {
        id: 'EMP037',
        firstName: 'Tomasz',
        lastName: 'Wrona',
        email: 'tomasz.wrona@westbrook.example',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'Mobile App Developer',
        hireDate: '2022-06-18',
        salary: 118000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.7
    },
    {
        id: 'EMP038',
        firstName: 'Lucia',
        lastName: 'Fernandez',
        email: 'lucia.fernandez@westbrook.example',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Customer Success Manager',
        hireDate: '2021-03-01',
        salary: 92000,
        status: 'active',
        location: 'chicago',
        manager: 'Priya Raman',
        performanceRating: 4.9
    },
    {
        id: 'EMP039',
        firstName: 'Kofi',
        lastName: 'Boateng',
        email: 'kofi.boateng@westbrook.example',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Email Marketing Specialist',
        hireDate: '2023-05-01',
        salary: 73000,
        status: 'active',
        location: 'remote',
        manager: 'Hannah Kowalski',
        performanceRating: 4.3
    },
    {
        id: 'EMP040',
        firstName: 'Anneke',
        lastName: 'de Vries',
        email: 'anneke.devries@westbrook.example',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Payroll Specialist',
        hireDate: '2022-04-10',
        salary: 80000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.4
    },
    {
        id: 'EMP041',
        firstName: 'Hiroshi',
        lastName: 'Nakagawa',
        email: 'hiroshi.nakagawa@westbrook.example',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'FP&A Analyst',
        hireDate: '2020-09-15',
        salary: 102000,
        status: 'active',
        location: 'new-york',
        manager: 'Ingrid Solheim',
        performanceRating: 4.7
    },
    {
        id: 'EMP042',
        firstName: 'Marisol',
        lastName: 'Vega',
        email: 'marisol.vega@westbrook.example',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'Data Scientist',
        hireDate: '2026-06-01',
        salary: 128000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.2
    },
    {
        id: 'EMP043',
        firstName: 'Callum',
        lastName: 'MacLeod',
        email: 'callum.macleod@westbrook.example',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Regional Sales Director',
        hireDate: '2020-08-20',
        salary: 135000,
        status: 'active',
        location: 'chicago',
        manager: 'Priya Raman',
        performanceRating: 4.9
    },
    {
        id: 'EMP044',
        firstName: 'Noor',
        lastName: 'Khalil',
        email: 'noor.khalil@westbrook.example',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Marketing Analyst',
        hireDate: '2022-10-18',
        salary: 76000,
        status: 'active',
        location: 'remote',
        manager: 'Hannah Kowalski',
        performanceRating: 4.6
    },
    {
        id: 'EMP045',
        firstName: 'Siobhan',
        lastName: 'Doyle',
        email: 'siobhan.doyle@westbrook.example',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'Talent Acquisition Specialist',
        hireDate: '2021-11-25',
        salary: 85000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.7
    },
    {
        id: 'EMP046',
        firstName: 'Thandiwe',
        lastName: 'Nkosi',
        email: 'thandiwe.nkosi@westbrook.example',
        phone: '+1 (555) 678-9012',
        department: 'finance',
        position: 'Procurement Specialist',
        hireDate: '2026-07-06',
        salary: 89000,
        status: 'active',
        location: 'new-york',
        manager: 'Ingrid Solheim',
        performanceRating: 4.3
    },
    {
        id: 'EMP047',
        firstName: 'Mikael',
        lastName: 'Lindqvist',
        email: 'mikael.lindqvist@westbrook.example',
        phone: '+1 (555) 789-0123',
        department: 'engineering',
        position: 'Cloud Engineer',
        hireDate: '2022-08-18',
        salary: 122000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.8
    },
    {
        id: 'EMP048',
        firstName: 'Rosa',
        lastName: 'Gutierrez',
        email: 'rosa.gutierrez@westbrook.example',
        phone: '+1 (555) 890-1234',
        department: 'sales',
        position: 'Sales Operations Analyst',
        hireDate: '2021-06-01',
        salary: 90000,
        status: 'active',
        location: 'chicago',
        manager: 'Priya Raman',
        performanceRating: 4.7
    },
    {
        id: 'EMP049',
        firstName: 'Aleksander',
        lastName: 'Nowak',
        email: 'aleksander.nowak@westbrook.example',
        phone: '+1 (555) 901-2345',
        department: 'marketing',
        position: 'Public Relations Specialist',
        hireDate: '2023-06-01',
        salary: 75000,
        status: 'active',
        location: 'remote',
        manager: 'Hannah Kowalski',
        performanceRating: 4.4
    },
    {
        id: 'EMP050',
        firstName: 'Farah',
        lastName: 'Mansour',
        email: 'farah.mansour@westbrook.example',
        phone: '+1 (555) 012-3456',
        department: 'hr',
        position: 'Employee Relations Specialist',
        hireDate: '2022-05-10',
        salary: 82000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.5
    },
    {
        id: 'EMP051',
        firstName: 'Wei',
        lastName: 'Zhang',
        email: 'wei.zhang@westbrook.example',
        phone: '+1 (555) 123-4567',
        department: 'finance',
        position: 'Investor Relations',
        hireDate: '2020-02-15',
        salary: 110000,
        status: 'active',
        location: 'new-york',
        manager: 'Ingrid Solheim',
        performanceRating: 4.8
    },
    {
        id: 'EMP052',
        firstName: 'Ifeoma',
        lastName: 'Chukwu',
        email: 'ifeoma.chukwu@westbrook.example',
        phone: '+1 (555) 234-5678',
        department: 'engineering',
        position: 'Security Engineer',
        hireDate: '2026-08-17',
        salary: 130000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Kwame Mensah',
        performanceRating: 4.3
    },
    {
        id: 'EMP053',
        firstName: 'Giovanni',
        lastName: 'Bianchi',
        email: 'giovanni.bianchi@westbrook.example',
        phone: '+1 (555) 345-6789',
        department: 'sales',
        position: 'Business Development Manager',
        hireDate: '2021-04-20',
        salary: 115000,
        status: 'active',
        location: 'chicago',
        manager: 'Priya Raman',
        performanceRating: 4.9
    },
    {
        id: 'EMP054',
        firstName: 'Katarzyna',
        lastName: 'Wojcik',
        email: 'katarzyna.wojcik@westbrook.example',
        phone: '+1 (555) 456-7890',
        department: 'marketing',
        position: 'Brand Manager',
        hireDate: '2022-11-18',
        salary: 80000,
        status: 'active',
        location: 'remote',
        manager: 'Hannah Kowalski',
        performanceRating: 4.7
    },
    {
        id: 'EMP055',
        firstName: 'Devraj',
        lastName: 'Kulkarni',
        email: 'devraj.kulkarni@westbrook.example',
        phone: '+1 (555) 567-8901',
        department: 'hr',
        position: 'Training and Development Manager',
        hireDate: '2021-12-25',
        salary: 88000,
        status: 'active',
        location: 'san-francisco',
        manager: 'Mei-Ling Tan',
        performanceRating: 4.8
    }
];

const sampleCandidates = [
    { name: 'Anders Nilsson', position: 'Software Engineer', stage: 'applied', score: 85 },
    { name: 'Adaeze Obi', position: 'Product Manager', stage: 'screening', score: 92 },
    { name: 'Rohan Mehta', position: 'Data Scientist', stage: 'interview', score: 88 },
    { name: 'Maya Lindgren', position: 'UX Designer', stage: 'offer', score: 94 },
    { name: 'Joon-ho Kim', position: 'DevOps Engineer', stage: 'hired', score: 90 }
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
        const tabLabel = (navItem.querySelector('span') || navItem).textContent.trim();
        document.title = `${tabLabel} | Human resources | Westbrook Industries`;
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
                <div class="employee-details">${employee.position}, ${formatDate(employee.hireDate)}</div>
            </div>
        `;
        container.appendChild(hireElement);
    });
}

function loadUpcomingReviews() {
    const container = document.getElementById('upcoming-reviews');
    if (!container) return;
    
    const upcomingReviews = [
        { name: 'Rajesh Iyer', date: '2026-10-12', type: 'Annual review' },
        { name: 'Kwame Mensah', date: '2026-10-14', type: 'Quarterly check-in' },
        { name: 'Mateo Alvarez', date: '2026-10-19', type: '90-day review' }
    ];
    
    container.innerHTML = '';
    upcomingReviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.innerHTML = `
            <div class="employee-avatar">${review.name.split(' ').map(n => n.charAt(0)).join('')}</div>
            <div class="employee-info">
                <div class="employee-name">${review.name}</div>
                <div class="employee-details">${review.type}, ${formatDate(review.date)}</div>
            </div>
        `;
        container.appendChild(reviewElement);
    });
}

// Chart helpers (colors come from the shared theme tokens)
function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function chartFont(size) {
    return `${size}px ${getComputedStyle(document.body).fontFamily}`;
}

function prepareCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return ctx;
}

function drawPie(canvas, labels, values, formatValue) {
    const ctx = prepareCanvas(canvas);
    const palette = [1, 2, 3, 4, 5, 6].map(i => cssVar(`--chart-${i}`));
    const surface = cssVar('--surface');
    const textColor = cssVar('--text');
    const mutedColor = cssVar('--text-muted');
    const total = values.reduce((sum, value) => sum + value, 0);
    const valueTexts = values.map(value => `${formatValue(value)} (${(value / total * 100).toFixed(1)}%)`);

    // Size the legend first so the pie can shrink on narrow panels
    ctx.font = chartFont(13);
    const labelWidth = Math.max(...labels.map(label => ctx.measureText(label).width));
    ctx.font = chartFont(12);
    const valueWidth = Math.max(...valueTexts.map(text => ctx.measureText(text).width));
    const legendWidth = 18 + labelWidth + 16 + valueWidth;

    const radius = Math.max(40, Math.min(95, (canvas.width - 16 - 28 - legendWidth) / 2));
    const centerX = 8 + radius;
    const centerY = canvas.height / 2;

    let startAngle = -Math.PI / 2;
    values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        ctx.fillStyle = palette[index % palette.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = surface;
        ctx.lineWidth = 2;
        ctx.stroke();
        startAngle += sliceAngle;
    });

    // Legend
    const legendX = centerX + radius + 28;
    const rowHeight = 26;
    const legendY = centerY - (values.length * rowHeight) / 2 + rowHeight / 2;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    values.forEach((value, index) => {
        const y = legendY + index * rowHeight;
        ctx.fillStyle = palette[index % palette.length];
        ctx.fillRect(legendX, y - 5, 10, 10);
        ctx.fillStyle = textColor;
        ctx.font = chartFont(13);
        ctx.fillText(labels[index], legendX + 18, y);
        ctx.fillStyle = mutedColor;
        ctx.font = chartFont(12);
        ctx.fillText(valueTexts[index], legendX + 18 + labelWidth + 16, y);
    });
}

function drawAxes(ctx, canvas, margins, maxValue, steps, formatTick) {
    const grid = cssVar('--chart-grid');
    const mutedColor = cssVar('--text-muted');
    const plotWidth = canvas.width - margins.left - margins.right;
    const plotHeight = canvas.height - margins.top - margins.bottom;
    ctx.font = chartFont(11);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.lineWidth = 1;
    for (let i = 0; i <= steps; i++) {
        const value = (maxValue / steps) * i;
        const y = Math.round(margins.top + plotHeight - (value / maxValue) * plotHeight) + 0.5;
        ctx.strokeStyle = grid;
        ctx.beginPath();
        ctx.moveTo(margins.left, y);
        ctx.lineTo(margins.left + plotWidth, y);
        ctx.stroke();
        ctx.fillStyle = mutedColor;
        ctx.fillText(formatTick(value), margins.left - 8, y);
    }
    return { plotWidth, plotHeight };
}

function createDepartmentChart() {
    const canvas = document.getElementById('department-chart');
    if (!canvas) return;

    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
    const counts = [45, 32, 28, 15, 22];
    drawPie(canvas, departments, counts, value => String(value));
}

function createAttendanceChart() {
    const canvas = document.getElementById('attendance-chart');
    if (!canvas) return;

    const ctx = prepareCanvas(canvas);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const attendance = [94, 96, 93, 97, 89];

    const margins = { top: 16, right: 16, bottom: 28, left: 40 };
    const { plotWidth, plotHeight } = drawAxes(ctx, canvas, margins, 100, 4, value => `${value}%`);
    const slot = plotWidth / attendance.length;
    const barWidth = Math.min(48, slot - 24);

    ctx.fillStyle = cssVar('--chart-1');
    attendance.forEach((rate, index) => {
        const barHeight = (rate / 100) * plotHeight;
        const x = margins.left + index * slot + (slot - barWidth) / 2;
        const y = margins.top + plotHeight - barHeight;
        ctx.fillRect(x, y, barWidth, barHeight);
    });

    ctx.fillStyle = cssVar('--text-muted');
    ctx.font = chartFont(12);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    days.forEach((day, index) => {
        ctx.fillText(day, margins.left + index * slot + slot / 2, canvas.height - margins.bottom + 8);
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
            <td>${departmentLabel(employee.department)}</td>
            <td>${employee.position}</td>
            <td>${formatDate(employee.hireDate)}</td>
            <td><span class="status-badge ${employee.status} ${statusTone(employee.status)}">${employee.status.replace('-', ' ')}</span></td>
            <td class="num">$${employee.salary.toLocaleString('en-US')}</td>
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
                <div class="candidate-score">Score: ${candidate.score}%</div>
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
        jobElement.className = 'posting-item';
        jobElement.innerHTML = `
            <div>
                <div class="posting-title">${job.title}</div>
                <div class="posting-meta">${job.applicants} applicants</div>
            </div>
            <span class="status-badge ${job.status.toLowerCase()} ${job.status === 'Active' ? 'tone-success' : 'tone-neutral'}">${job.status}</span>
        `;
        container.appendChild(jobElement);
    });
}

// Performance functions
function loadPerformance() {
    loadReviewCalendar();
    loadTopPerformers();
    loadGoalsChart();
    loadFeedbackStats();
}

function loadReviewCalendar() {
    const container = document.getElementById('review-calendar');
    if (!container) return;

    const scheduledReviews = [
        { date: '2026-10-12', name: 'Rajesh Iyer', type: 'Annual review' },
        { date: '2026-10-14', name: 'Kwame Mensah', type: 'Quarterly check-in' },
        { date: '2026-10-19', name: 'Mateo Alvarez', type: '90-day review' },
        { date: '2026-10-27', name: 'Yuki Tanaka', type: 'Annual review' },
        { date: '2026-11-03', name: 'Oliver Grant', type: 'Quarterly check-in' }
    ];

    container.innerHTML = '';
    scheduledReviews.forEach(review => {
        const rowElement = document.createElement('div');
        rowElement.className = 'list-row';
        rowElement.innerHTML = `
            <div>
                <div class="list-row-title">${review.name}</div>
                <div class="list-row-meta">${review.type}</div>
            </div>
            <span class="list-row-meta">${formatDate(review.date)}</span>
        `;
        container.appendChild(rowElement);
    });
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
        performerElement.className = 'performer-item';
        performerElement.innerHTML = `
            <div class="performer-rank">${index + 1}</div>
            <div class="employee-avatar">${performer.firstName.charAt(0)}${performer.lastName.charAt(0)}</div>
            <div class="performer-info">
                <div class="employee-name">${performer.firstName} ${performer.lastName}</div>
                <div class="employee-details">${performer.position}</div>
            </div>
            <div class="performer-rating">${performer.performanceRating}/5</div>
        `;
        container.appendChild(performerElement);
    });
}

function loadGoalsChart() {
    const canvas = document.getElementById('goals-chart');
    if (!canvas) return;

    const ctx = prepareCanvas(canvas);

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const goalsMet = [78, 82, 75, 84];

    const margins = { top: 16, right: 24, bottom: 28, left: 40 };
    const { plotWidth, plotHeight } = drawAxes(ctx, canvas, margins, 100, 4, value => `${value}%`);
    const step = plotWidth / quarters.length;
    const points = goalsMet.map((percentage, index) => ({
        x: margins.left + step * index + step / 2,
        y: margins.top + plotHeight - (percentage / 100) * plotHeight
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

    points.forEach((point, index) => {
        ctx.fillStyle = cssVar('--chart-1');
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = cssVar('--text');
        ctx.font = chartFont(11);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${goalsMet[index]}%`, point.x, point.y - 8);
    });

    ctx.fillStyle = cssVar('--text-muted');
    ctx.font = chartFont(12);
    ctx.textBaseline = 'top';
    quarters.forEach((quarter, index) => {
        ctx.fillText(quarter, points[index].x, canvas.height - margins.bottom + 8);
    });
}

function loadFeedbackStats() {
    const container = document.getElementById('feedback-stats');
    if (!container) return;
    
    const feedbackData = [
        { category: 'Communication', average: 4.2 },
        { category: 'Leadership', average: 3.8 },
        { category: 'Technical skills', average: 4.5 },
        { category: 'Teamwork', average: 4.1 }
    ];
    
    container.innerHTML = '';
    feedbackData.forEach(item => {
        const statElement = document.createElement('div');
        statElement.className = 'feedback-row';
        statElement.innerHTML = `
            <span>${item.category}</span>
            <span class="feedback-score">${item.average}/5</span>
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

    const categories = ['Salaries', 'Benefits', 'Taxes', 'Other'];
    const amounts = [1200000, 234120, 392450, 89760];
    drawPie(canvas, categories, amounts, amount => `$${Math.round(amount / 1000).toLocaleString('en-US')}K`);
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
        bandElement.className = 'band-item';
        bandElement.innerHTML = `
            <div class="band-name">${band.department}</div>
            <div class="band-range">
                <span>Min: $${band.min.toLocaleString('en-US')}</span>
                <span>Avg: $${band.avg.toLocaleString('en-US')}</span>
                <span>Max: $${band.max.toLocaleString('en-US')}</span>
            </div>
        `;
        container.appendChild(bandElement);
    });
}

function loadPayrollCalendar() {
    const container = document.getElementById('payroll-calendar');
    if (!container) return;
    
    const payrollEvents = [
        { date: '2026-10-15', event: 'Bi-weekly payroll', type: 'payroll' },
        { date: '2026-10-30', event: 'Monthly benefits', type: 'benefits' },
        { date: '2026-11-02', event: 'Tax filing due', type: 'tax' },
        { date: '2026-11-13', event: 'Bi-weekly payroll', type: 'payroll' }
    ];
    
    container.innerHTML = '';
    payrollEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'list-row';
        eventElement.innerHTML = `
            <span class="list-row-title">${event.event}</span>
            <span class="list-row-meta">${formatDate(event.date)}</span>
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
        { name: 'Premium health plan', enrollment: '89%', cost: '$450/month' },
        { name: 'Basic health plan', enrollment: '11%', cost: '$200/month' }
    ];
    
    container.innerHTML = '';
    healthPlans.forEach(plan => {
        const planElement = document.createElement('div');
        planElement.className = 'plan-item';
        planElement.innerHTML = `
            <div class="plan-name">${plan.name}</div>
            <div class="plan-details">Enrollment: ${plan.enrollment}, cost: ${plan.cost}</div>
        `;
        container.appendChild(planElement);
    });
}

function loadRetirementPlans() {
    const container = document.getElementById('retirement-plans');
    if (!container) return;
    
    const retirementPlans = [
        { name: '401(k) plan', enrollment: '65%', match: '4% company match' },
        { name: 'Roth IRA option', enrollment: '23%', match: 'no match' }
    ];
    
    container.innerHTML = '';
    retirementPlans.forEach(plan => {
        const planElement = document.createElement('div');
        planElement.className = 'plan-item';
        planElement.innerHTML = `
            <div class="plan-name">${plan.name}</div>
            <div class="plan-details">Enrollment: ${plan.enrollment}, ${plan.match}</div>
        `;
        container.appendChild(planElement);
    });
}

function loadAdditionalBenefits() {
    const container = document.getElementById('additional-benefits');
    if (!container) return;
    
    const additionalBenefits = [
        { name: 'Dental insurance', enrollment: '76%', cost: '$25/month' },
        { name: 'Vision insurance', enrollment: '82%', cost: '$15/month' },
        { name: 'Life insurance', enrollment: '94%', cost: 'company paid' },
        { name: 'Flexible spending account', enrollment: '45%', cost: 'pre-tax' }
    ];
    
    container.innerHTML = '';
    additionalBenefits.forEach(benefit => {
        const benefitElement = document.createElement('div');
        benefitElement.className = 'plan-item';
        benefitElement.innerHTML = `
            <div class="plan-name">${benefit.name}</div>
            <div class="plan-details">Enrollment: ${benefit.enrollment}, cost: ${benefit.cost}</div>
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
        { name: 'Monthly headcount report', date: '2026-09-15', type: 'PDF' },
        { name: 'Compensation analysis', date: '2026-09-12', type: 'Excel' },
        { name: 'Performance review summary', date: '2026-09-10', type: 'PDF' },
        { name: 'Turnover analysis', date: '2026-09-08', type: 'Excel' }
    ];
    
    container.innerHTML = '';
    recentReports.forEach(report => {
        const reportElement = document.createElement('div');
        reportElement.className = 'list-row';
        reportElement.innerHTML = `
            <div>
                <div class="list-row-title">${report.name}</div>
                <div class="list-row-meta">${formatDate(report.date)}</div>
            </div>
            <span class="badge">${report.type}</span>
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
        manager: 'Mei-Ling Tan',
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function departmentLabel(department) {
    return department === 'hr' ? 'HR' : capitalizeFirst(department);
}

function statusTone(status) {
    if (status === 'active') return 'tone-success';
    if (status === 'on-leave') return 'tone-warning';
    if (status === 'terminated') return 'tone-danger';
    return 'tone-neutral';
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