#!/usr/bin/env python3
"""
Business Intelligence Dashboard Backend Server
A Python HTTP server that provides REST API endpoints for the BI dashboard.
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import sys
from datetime import datetime, timedelta
import random
import uuid

# Sample data for BI dashboard
bi_data = {
    "overview": {
        "kpis": {
            "totalRevenue": 2800000,
            "orders": 1247,
            "activeCustomers": 18924,
            "conversionRate": 67,
            "lastUpdated": datetime.now().isoformat()
        },
        "revenueData": {
            "daily": [45000, 52000, 48000, 61000, 58000, 65000, 72000],
            "weekly": [315000, 364000, 336000, 427000, 406000, 455000, 504000],
            "monthly": [1350000, 1560000, 1440000, 1830000, 1740000, 1950000, 2160000]
        },
        "categories": {
            "labels": ["Electronics", "Software", "Services", "Consulting", "Hardware"],
            "data": [850000, 650000, 480000, 520000, 300000]
        },
        "performance": {
            "sales": 85,
            "marketing": 92,
            "support": 78,
            "product": 88,
            "finance": 95
        }
    },
    "sales": {
        "metrics": {
            "performance": 847320,
            "previousPerformance": 789450,
            "dealSize": 12450,
            "previousDealSize": 11890,
            "salesCycle": 45,
            "previousSalesCycle": 52
        },
        "pipeline": {
            "labels": ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"],
            "data": [145, 89, 67, 45, 23]
        },
        "topPerformers": [
            {"name": "Sarah Johnson", "role": "Senior Sales Rep", "sales": 124500},
            {"name": "Mike Chen", "role": "Account Manager", "sales": 108900},
            {"name": "Emma Davis", "role": "Sales Rep", "sales": 95600},
            {"name": "Alex Wilson", "role": "Senior Account Manager", "sales": 87300},
            {"name": "Lisa Brown", "role": "Sales Rep", "sales": 78200}
        ],
        "regionalData": {
            "north": {"revenue": 1250000, "deals": 234},
            "europe": {"revenue": 950000, "deals": 189},
            "asia": {"revenue": 600000, "deals": 156}
        }
    },
    "operations": {
        "metrics": {
            "inventory": 87,
            "efficiency": 94.2,
            "fulfillment": 2.3,
            "quality": 99.1
        },
        "inventoryBreakdown": {
            "inStock": 87,
            "lowStock": 10,
            "outOfStock": 3
        },
        "efficiencyTrend": [91.2, 92.8, 93.5, 94.2],
        "fulfillmentTimes": [2.1, 2.3, 2.0, 2.4, 2.2],
        "qualityScores": [98.5, 98.8, 99.0, 98.9, 99.1, 99.1]
    },
    "customers": {
        "metrics": {
            "total": 18924,
            "averageValue": 2340,
            "retentionRate": 72,
            "satisfactionScore": 4.6
        },
        "segmentation": {
            "labels": ["New", "Returning", "VIP", "Inactive"],
            "data": [4234, 8956, 2847, 2887]
        },
        "ltv": {
            "labels": ["0-6M", "6-12M", "1-2Y", "2-5Y", "5Y+"],
            "data": [850, 1850, 3200, 5600, 8900]
        },
        "acquisition": [234, 189, 267, 298, 245, 287]
    },
    "financial": {
        "summary": {
            "revenue": 2845320,
            "expenses": 1847920,
            "netIncome": 997400,
            "profitMargin": 35.1
        },
        "monthlyData": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "revenue": [220000, 245000, 268000, 289000, 312000, 298000, 325000, 341000, 356000, 378000, 392000, 421000],
            "expenses": [142000, 158000, 173000, 187000, 201000, 192000, 209000, 219000, 229000, 243000, 252000, 271000]
        },
        "cashflow": {
            "labels": ["Q1", "Q2", "Q3", "Q4"],
            "data": [234000, 287000, 312000, 356000]
        }
    },
    "reports": {
        "available": [
            {
                "id": "executive",
                "title": "Executive Summary",
                "description": "High-level overview of business performance",
                "lastUpdated": "2024-01-15T14:30:00Z",
                "type": "PDF",
                "size": "2.4 MB"
            },
            {
                "id": "sales",
                "title": "Sales Performance",
                "description": "Detailed sales analysis and trends",
                "lastUpdated": "2024-01-15T12:15:00Z",
                "type": "Excel",
                "size": "5.7 MB"
            },
            {
                "id": "customer",
                "title": "Customer Analysis",
                "description": "Customer behavior and segmentation insights",
                "lastUpdated": "2024-01-15T10:45:00Z",
                "type": "PDF",
                "size": "3.1 MB"
            },
            {
                "id": "financial",
                "title": "Financial Report",
                "description": "Financial statements and analysis",
                "lastUpdated": "2024-01-14T16:20:00Z",
                "type": "Excel",
                "size": "4.8 MB"
            }
        ]
    }
}

class BIRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Handle API requests
        if path.startswith('/api/'):
            self.handle_api_request('GET', path, None)
        else:
            # Serve static files
            if path == '/':
                path = '/index.html'
            super().do_GET()
    
    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path.startswith('/api/'):
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(post_data) if post_data else {}
            except json.JSONDecodeError:
                data = {}
            
            self.handle_api_request('POST', path, data)
        else:
            self.send_error(404, "Not Found")
    
    def handle_api_request(self, method, path, data):
        # Enable CORS
        self.send_cors_headers()
        
        try:
            if path == '/api/overview':
                if method == 'GET':
                    self.send_json_response(bi_data['overview'])
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/overview/kpis':
                if method == 'GET':
                    # Add some randomness to simulate real-time data
                    kpis = bi_data['overview']['kpis'].copy()
                    kpis['totalRevenue'] += random.randint(-50000, 50000)
                    kpis['orders'] += random.randint(-20, 20)
                    kpis['activeCustomers'] += random.randint(-100, 100)
                    kpis['conversionRate'] += random.randint(-5, 5)
                    kpis['lastUpdated'] = datetime.now().isoformat()
                    self.send_json_response(kpis)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/sales':
                if method == 'GET':
                    query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    region = query_params.get('region', ['all'])[0]
                    product = query_params.get('product', ['all'])[0]
                    
                    sales_data = bi_data['sales'].copy()
                    
                    # Filter by region if specified
                    if region != 'all' and region in sales_data['regionalData']:
                        sales_data['filtered'] = sales_data['regionalData'][region]
                    
                    self.send_json_response(sales_data)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/operations':
                if method == 'GET':
                    self.send_json_response(bi_data['operations'])
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/customers':
                if method == 'GET':
                    query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    segment = query_params.get('segment', ['all'])[0]
                    
                    customers_data = bi_data['customers'].copy()
                    
                    # Filter by segment if specified
                    if segment != 'all':
                        # Simulate segment filtering
                        customers_data['filtered'] = True
                        customers_data['segment'] = segment
                    
                    self.send_json_response(customers_data)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/financial':
                if method == 'GET':
                    query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    period = query_params.get('period', ['monthly'])[0]
                    
                    financial_data = bi_data['financial'].copy()
                    financial_data['period'] = period
                    
                    self.send_json_response(financial_data)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/reports':
                if method == 'GET':
                    self.send_json_response(bi_data['reports'])
                elif method == 'POST':
                    # Generate custom report
                    report_config = data
                    new_report = self.generate_custom_report(report_config)
                    self.send_json_response(new_report, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path.startswith('/api/reports/'):
                report_id = path.split('/')[-1]
                if method == 'GET':
                    report = self.get_report_by_id(report_id)
                    if report:
                        self.send_json_response(report)
                    else:
                        self.send_error(404, "Report not found")
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/export':
                if method == 'POST':
                    export_config = data
                    export_result = self.export_data(export_config)
                    self.send_json_response(export_result)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/refresh':
                if method == 'POST':
                    # Simulate data refresh
                    self.refresh_data()
                    self.send_json_response({"status": "success", "message": "Data refreshed"})
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/dashboard':
                if method == 'GET':
                    dashboard_data = self.get_dashboard_summary()
                    self.send_json_response(dashboard_data)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            else:
                self.send_error(404, "API endpoint not found")
        
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")
    
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))
    
    def generate_custom_report(self, config):
        """Generate a custom report based on configuration"""
        return {
            "id": str(uuid.uuid4()),
            "title": config.get('title', 'Custom Report'),
            "description": config.get('description', 'Generated custom report'),
            "type": config.get('type', 'PDF'),
            "lastUpdated": datetime.now().isoformat(),
            "size": f"{random.uniform(1.0, 10.0):.1f} MB",
            "status": "generated",
            "downloadUrl": f"/api/reports/{uuid.uuid4()}/download"
        }
    
    def get_report_by_id(self, report_id):
        """Get a specific report by ID"""
        for report in bi_data['reports']['available']:
            if report['id'] == report_id:
                return report
        return None
    
    def export_data(self, config):
        """Export data based on configuration"""
        return {
            "exportId": str(uuid.uuid4()),
            "format": config.get('format', 'CSV'),
            "status": "processing",
            "estimatedTime": "2-3 minutes",
            "downloadUrl": f"/api/exports/{uuid.uuid4()}/download"
        }
    
    def refresh_data(self):
        """Simulate data refresh"""
        # Add some randomness to simulate real-time updates
        bi_data['overview']['kpis']['totalRevenue'] += random.randint(-100000, 100000)
        bi_data['overview']['kpis']['orders'] += random.randint(-50, 50)
        bi_data['overview']['kpis']['activeCustomers'] += random.randint(-200, 200)
        bi_data['overview']['kpis']['lastUpdated'] = datetime.now().isoformat()
        
        # Update sales metrics
        bi_data['sales']['metrics']['performance'] += random.randint(-10000, 10000)
        bi_data['sales']['metrics']['dealSize'] += random.randint(-500, 500)
        
        # Update operations metrics
        bi_data['operations']['metrics']['efficiency'] += random.uniform(-1.0, 1.0)
        bi_data['operations']['metrics']['quality'] += random.uniform(-0.5, 0.5)
    
    def get_dashboard_summary(self):
        """Get dashboard summary data"""
        return {
            "timestamp": datetime.now().isoformat(),
            "kpis": bi_data['overview']['kpis'],
            "alerts": [
                {
                    "type": "warning",
                    "message": "Inventory levels are running low for 3 products",
                    "timestamp": datetime.now().isoformat()
                },
                {
                    "type": "success",
                    "message": "Monthly sales target exceeded by 15%",
                    "timestamp": (datetime.now() - timedelta(hours=2)).isoformat()
                }
            ],
            "recentActivity": [
                {
                    "type": "report",
                    "message": "Executive summary report generated",
                    "timestamp": (datetime.now() - timedelta(minutes=30)).isoformat()
                },
                {
                    "type": "data",
                    "message": "Sales data refreshed",
                    "timestamp": (datetime.now() - timedelta(hours=1)).isoformat()
                }
            ]
        }
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

def main():
    # Determine port from command line argument or use default
    port = 8001
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8001.")
    
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Create server
    handler = BIRequestHandler
    httpd = socketserver.TCPServer(("", port), handler)
    
    print(f"Business Intelligence Dashboard server starting on port {port}")
    print(f"Access the application at: http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()

if __name__ == "__main__":
    main()