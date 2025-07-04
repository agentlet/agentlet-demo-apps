#!/usr/bin/env python3
"""
ERP System Backend Server
A Python HTTP server that provides REST API endpoints for the ERP system.
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import sys
from datetime import datetime
import uuid

# Sample data for ERP system
erp_data = {
    "inventory": [
        {
            "id": "IT001",
            "name": "Laptop Computer",
            "category": "electronics",
            "stock": 45,
            "price": 1299.99,
            "reorderPoint": 10,
            "lastUpdated": "2024-01-15T10:30:00Z"
        },
        {
            "id": "OF002",
            "name": "Office Chair",
            "category": "office",
            "stock": 23,
            "price": 189.99,
            "reorderPoint": 5,
            "lastUpdated": "2024-01-14T14:20:00Z"
        },
        {
            "id": "RM003",
            "name": "Steel Sheets",
            "category": "raw-materials",
            "stock": 156,
            "price": 89.50,
            "reorderPoint": 50,
            "lastUpdated": "2024-01-13T09:15:00Z"
        },
        {
            "id": "IT004",
            "name": "Monitor 24\"",
            "category": "electronics",
            "stock": 8,
            "price": 299.99,
            "reorderPoint": 15,
            "lastUpdated": "2024-01-12T16:45:00Z"
        }
    ],
    "employees": [
        {
            "id": "EMP001",
            "name": "John Smith",
            "department": "Engineering",
            "position": "Senior Engineer",
            "hireDate": "2021-03-15",
            "salary": 85000,
            "email": "john.smith@nexuscorp.com",
            "status": "active"
        },
        {
            "id": "EMP002",
            "name": "Sarah Johnson",
            "department": "Sales",
            "position": "Sales Manager",
            "hireDate": "2020-01-22",
            "salary": 72000,
            "email": "sarah.johnson@nexuscorp.com",
            "status": "active"
        },
        {
            "id": "EMP003",
            "name": "Mike Davis",
            "department": "HR",
            "position": "HR Specialist",
            "hireDate": "2022-06-10",
            "salary": 58000,
            "email": "mike.davis@nexuscorp.com",
            "status": "active"
        }
    ],
    "transactions": [
        {
            "id": "TXN001",
            "description": "Office Equipment Purchase",
            "amount": -15420.50,
            "date": "2024-01-15",
            "type": "expense",
            "category": "operations",
            "account": "Equipment"
        },
        {
            "id": "TXN002",
            "description": "Customer Payment - ABC Corp",
            "amount": 45000.00,
            "date": "2024-01-14",
            "type": "income",
            "category": "revenue",
            "account": "Accounts Receivable"
        },
        {
            "id": "TXN003",
            "description": "Utility Bills",
            "amount": -2340.75,
            "date": "2024-01-13",
            "type": "expense",
            "category": "operations",
            "account": "Utilities"
        }
    ],
    "purchaseOrders": [
        {
            "id": "PO001",
            "supplier": "Tech Solutions Ltd",
            "amount": 25400.00,
            "status": "pending",
            "date": "2024-01-15",
            "items": [
                {"name": "Laptops", "quantity": 20, "unitPrice": 1270.00}
            ]
        },
        {
            "id": "PO002",
            "supplier": "Office Supplies Co",
            "amount": 1250.75,
            "status": "approved",
            "date": "2024-01-14",
            "items": [
                {"name": "Office Chairs", "quantity": 5, "unitPrice": 189.99},
                {"name": "Desk Supplies", "quantity": 1, "unitPrice": 301.80}
            ]
        }
    ],
    "reports": {
        "financial": {
            "totalRevenue": 2845320.00,
            "totalExpenses": 1847920.00,
            "netIncome": 997400.00,
            "assets": 4892340.00,
            "liabilities": 1247890.00,
            "equity": 3644450.00
        },
        "inventory": {
            "totalItems": 1247,
            "totalValue": 892340.50,
            "lowStockItems": 23,
            "reorderRequired": 12
        },
        "hr": {
            "totalEmployees": 156,
            "newHires": 12,
            "openPositions": 3,
            "payrollExpense": 1456780.00
        }
    }
}

class ERPRequestHandler(http.server.SimpleHTTPRequestHandler):
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
    
    def do_PUT(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path.startswith('/api/'):
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(post_data) if post_data else {}
            except json.JSONDecodeError:
                data = {}
            
            self.handle_api_request('PUT', path, data)
        else:
            self.send_error(404, "Not Found")
    
    def do_DELETE(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path.startswith('/api/'):
            self.handle_api_request('DELETE', path, None)
        else:
            self.send_error(404, "Not Found")
    
    def handle_api_request(self, method, path, data):
        # Enable CORS
        self.send_cors_headers()
        
        try:
            if path == '/api/inventory':
                if method == 'GET':
                    self.send_json_response(erp_data['inventory'])
                elif method == 'POST':
                    new_item = self.create_inventory_item(data)
                    erp_data['inventory'].append(new_item)
                    self.send_json_response(new_item, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path.startswith('/api/inventory/'):
                item_id = path.split('/')[-1]
                if method == 'GET':
                    item = self.find_inventory_item(item_id)
                    if item:
                        self.send_json_response(item)
                    else:
                        self.send_error(404, "Item not found")
                elif method == 'PUT':
                    item = self.update_inventory_item(item_id, data)
                    if item:
                        self.send_json_response(item)
                    else:
                        self.send_error(404, "Item not found")
                elif method == 'DELETE':
                    if self.delete_inventory_item(item_id):
                        self.send_json_response({"message": "Item deleted"})
                    else:
                        self.send_error(404, "Item not found")
            
            elif path == '/api/employees':
                if method == 'GET':
                    self.send_json_response(erp_data['employees'])
                elif method == 'POST':
                    new_employee = self.create_employee(data)
                    erp_data['employees'].append(new_employee)
                    self.send_json_response(new_employee, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path.startswith('/api/employees/'):
                employee_id = path.split('/')[-1]
                if method == 'GET':
                    employee = self.find_employee(employee_id)
                    if employee:
                        self.send_json_response(employee)
                    else:
                        self.send_error(404, "Employee not found")
                elif method == 'PUT':
                    employee = self.update_employee(employee_id, data)
                    if employee:
                        self.send_json_response(employee)
                    else:
                        self.send_error(404, "Employee not found")
                elif method == 'DELETE':
                    if self.delete_employee(employee_id):
                        self.send_json_response({"message": "Employee deleted"})
                    else:
                        self.send_error(404, "Employee not found")
            
            elif path == '/api/transactions':
                if method == 'GET':
                    self.send_json_response(erp_data['transactions'])
                elif method == 'POST':
                    new_transaction = self.create_transaction(data)
                    erp_data['transactions'].append(new_transaction)
                    self.send_json_response(new_transaction, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/purchase-orders':
                if method == 'GET':
                    self.send_json_response(erp_data['purchaseOrders'])
                elif method == 'POST':
                    new_po = self.create_purchase_order(data)
                    erp_data['purchaseOrders'].append(new_po)
                    self.send_json_response(new_po, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/reports':
                if method == 'GET':
                    self.send_json_response(erp_data['reports'])
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/dashboard':
                if method == 'GET':
                    dashboard_data = self.get_dashboard_data()
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
    
    def create_inventory_item(self, data):
        return {
            "id": data.get('id', f"IT{len(erp_data['inventory']) + 1:03d}"),
            "name": data.get('name', ''),
            "category": data.get('category', ''),
            "stock": data.get('stock', 0),
            "price": data.get('price', 0.0),
            "reorderPoint": data.get('reorderPoint', 10),
            "lastUpdated": datetime.now().isoformat() + 'Z'
        }
    
    def find_inventory_item(self, item_id):
        return next((item for item in erp_data['inventory'] if item['id'] == item_id), None)
    
    def update_inventory_item(self, item_id, data):
        item = self.find_inventory_item(item_id)
        if item:
            item.update(data)
            item['lastUpdated'] = datetime.now().isoformat() + 'Z'
            return item
        return None
    
    def delete_inventory_item(self, item_id):
        item = self.find_inventory_item(item_id)
        if item:
            erp_data['inventory'].remove(item)
            return True
        return False
    
    def create_employee(self, data):
        return {
            "id": data.get('id', f"EMP{len(erp_data['employees']) + 1:03d}"),
            "name": data.get('name', ''),
            "department": data.get('department', ''),
            "position": data.get('position', ''),
            "hireDate": data.get('hireDate', datetime.now().strftime('%Y-%m-%d')),
            "salary": data.get('salary', 0),
            "email": data.get('email', ''),
            "status": data.get('status', 'active')
        }
    
    def find_employee(self, employee_id):
        return next((emp for emp in erp_data['employees'] if emp['id'] == employee_id), None)
    
    def update_employee(self, employee_id, data):
        employee = self.find_employee(employee_id)
        if employee:
            employee.update(data)
            return employee
        return None
    
    def delete_employee(self, employee_id):
        employee = self.find_employee(employee_id)
        if employee:
            erp_data['employees'].remove(employee)
            return True
        return False
    
    def create_transaction(self, data):
        return {
            "id": data.get('id', f"TXN{len(erp_data['transactions']) + 1:03d}"),
            "description": data.get('description', ''),
            "amount": data.get('amount', 0.0),
            "date": data.get('date', datetime.now().strftime('%Y-%m-%d')),
            "type": data.get('type', 'expense'),
            "category": data.get('category', ''),
            "account": data.get('account', '')
        }
    
    def create_purchase_order(self, data):
        return {
            "id": data.get('id', f"PO{len(erp_data['purchaseOrders']) + 1:03d}"),
            "supplier": data.get('supplier', ''),
            "amount": data.get('amount', 0.0),
            "status": data.get('status', 'pending'),
            "date": data.get('date', datetime.now().strftime('%Y-%m-%d')),
            "items": data.get('items', [])
        }
    
    def get_dashboard_data(self):
        return {
            "metrics": {
                "totalRevenue": erp_data['reports']['financial']['totalRevenue'],
                "inventoryItems": len(erp_data['inventory']),
                "activeEmployees": len([emp for emp in erp_data['employees'] if emp['status'] == 'active']),
                "pendingOrders": len([po for po in erp_data['purchaseOrders'] if po['status'] == 'pending'])
            },
            "recentActivities": [
                {"icon": "📦", "title": "Inventory Updated", "time": "2 hours ago"},
                {"icon": "💰", "title": "Payment Received", "time": "4 hours ago"},
                {"icon": "👥", "title": "New Employee Added", "time": "6 hours ago"},
                {"icon": "📋", "title": "Purchase Order Created", "time": "1 day ago"}
            ]
        }
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

def main():
    # Determine port from command line argument or use default
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8000.")
    
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Create server
    handler = ERPRequestHandler
    httpd = socketserver.TCPServer(("", port), handler)
    
    print(f"ERP System server starting on port {port}")
    print(f"Access the application at: http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()

if __name__ == "__main__":
    main()