# Nexus Corp - Business Applications Portal

A collection of corporate-style, AI-generated single-page applications built with HTML, CSS, and JavaScript, featuring a Python backend for data simulation.

## Applications

- **Main Portal (`index.html`)**: Central hub for accessing all business applications.
- **BI (`bi/`)**: Business Intelligence dashboard for data visualization and analytics.
- **CRM (`crm/`)**: Customer Relationship Management system.
- **ERP (`erp/`)**: Enterprise Resource Planning application.
- **Helpdesk (`helpdesk/`)**: Ticketing and support system.
- **HR (`hr/`)**: Human Resources management application.
- **Projects (`projects/`)**: Project management tool.

## Features

- **Professional Design**: Corporate-style UI with clean, professional aesthetics
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Forms**: Complex multi-section forms with validation
- **Data Management**: JSON-based storage with Python backend
- **Real-time Updates**: Dynamic content updates without page refresh
- **Keyboard Shortcuts**: Alt+1-5 for tab navigation, Ctrl/Cmd+N for new records

## Getting Started

### Quick Start (Static Mode)
Simply open `index.html` in your web browser to access the portal and navigate to the CRM application.

### Full Featured Mode (with Backend)
1. Navigate to the CRM directory:
   ```bash
   cd crm
   ```

2. Start the Python server:
   ```bash
   python3 server.py
   ```
   Or specify a custom port:
   ```bash
   python3 server.py 8080
   ```

3. Open your browser and go to:
   ```
   http://localhost:8080
   ```



## Technical Details

### Frontend Technologies
- HTML5 with semantic markup
- CSS3 with Grid and Flexbox
- Vanilla JavaScript (ES6+)
- Responsive design principles

### Backend Features
- Python HTTP server with REST API
- JSON file-based data storage
- CORS support for cross-origin requests
- RESTful endpoints for CRUD operations



## Sample Data

The application comes with realistic sample data including:
- 5 sample customers from various industries
- Multiple sales opportunities in different stages
- Activity history and notes
- Realistic contact information and company details

## Included Applications

The portal is designed to accommodate additional business applications:
- Enterprise Resource Planning (ERP)
- Business Intelligence Dashboard
- Help Desk & Ticketing System
- Human Resources Management
- Project Management Tools

## Company Branding

**Nexus Corp** - The fictional company used throughout the applications features:
- Professional blue and gray color scheme
- Hexagonal logo design
- Consistent corporate identity
- Enterprise-grade UI patterns

## Browser Compatibility

- Chrome/Chromium 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## License

This project is for demonstration purposes. Feel free to use and modify for your own projects.