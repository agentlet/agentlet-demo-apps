#!/usr/bin/env python3
"""
Simple Python server for Nexus CRM application
Provides basic CRUD operations with JSON file storage
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
import urllib.parse
from datetime import datetime
import sys

class CRMHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.data_file = 'crm_data.json'
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path.startswith('/api/'):
            self.handle_api_get()
        else:
            # Serve static files
            super().do_GET()
    
    def do_POST(self):
        """Handle POST requests"""
        if self.path.startswith('/api/'):
            self.handle_api_post()
        else:
            self.send_error(404)
    
    def do_PUT(self):
        """Handle PUT requests"""
        if self.path.startswith('/api/'):
            self.handle_api_put()
        else:
            self.send_error(404)
    
    def do_DELETE(self):
        """Handle DELETE requests"""
        if self.path.startswith('/api/'):
            self.handle_api_delete()
        else:
            self.send_error(404)
    
    def handle_api_get(self):
        """Handle API GET requests"""
        try:
            data = self.load_data()
            
            if self.path == '/api/customers':
                self.send_json_response(data.get('customers', []))
            elif self.path == '/api/opportunities':
                self.send_json_response(data.get('opportunities', []))
            elif self.path == '/api/activities':
                self.send_json_response(data.get('activities', []))
            elif self.path.startswith('/api/customers/'):
                customer_id = int(self.path.split('/')[-1])
                customer = next((c for c in data.get('customers', []) if c['id'] == customer_id), None)
                if customer:
                    self.send_json_response(customer)
                else:
                    self.send_error(404, "Customer not found")
            else:
                self.send_error(404, "API endpoint not found")
        except Exception as e:
            self.send_error(500, str(e))
    
    def handle_api_post(self):
        """Handle API POST requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            data = self.load_data()
            
            if self.path == '/api/customers':
                new_customer = self.create_customer(request_data, data)
                self.save_data(data)
                self.send_json_response(new_customer, 201)
            elif self.path == '/api/opportunities':
                new_opportunity = self.create_opportunity(request_data, data)
                self.save_data(data)
                self.send_json_response(new_opportunity, 201)
            elif self.path == '/api/activities':
                new_activity = self.create_activity(request_data, data)
                self.save_data(data)
                self.send_json_response(new_activity, 201)
            else:
                self.send_error(404, "API endpoint not found")
        except Exception as e:
            self.send_error(500, str(e))
    
    def handle_api_put(self):
        """Handle API PUT requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            data = self.load_data()
            
            if self.path.startswith('/api/customers/'):
                customer_id = int(self.path.split('/')[-1])
                updated_customer = self.update_customer(customer_id, request_data, data)
                if updated_customer:
                    self.save_data(data)
                    self.send_json_response(updated_customer)
                else:
                    self.send_error(404, "Customer not found")
            else:
                self.send_error(404, "API endpoint not found")
        except Exception as e:
            self.send_error(500, str(e))
    
    def handle_api_delete(self):
        """Handle API DELETE requests"""
        try:
            data = self.load_data()
            
            if self.path.startswith('/api/customers/'):
                customer_id = int(self.path.split('/')[-1])
                if self.delete_customer(customer_id, data):
                    self.save_data(data)
                    self.send_json_response({"message": "Customer deleted successfully"})
                else:
                    self.send_error(404, "Customer not found")
            else:
                self.send_error(404, "API endpoint not found")
        except Exception as e:
            self.send_error(500, str(e))
    
    def create_customer(self, customer_data, data):
        """Create a new customer"""
        customers = data.setdefault('customers', [])
        new_id = max([c['id'] for c in customers], default=0) + 1
        
        new_customer = {
            'id': new_id,
            'company': customer_data.get('company', ''),
            'contact': customer_data.get('contact', ''),
            'email': customer_data.get('email', ''),
            'phone': customer_data.get('phone', ''),
            'industry': customer_data.get('industry', ''),
            'status': customer_data.get('status', 'prospect'),
            'jobTitle': customer_data.get('jobTitle', ''),
            'address': customer_data.get('address', ''),
            'revenue': customer_data.get('revenue', ''),
            'employees': customer_data.get('employees', 0),
            'notes': customer_data.get('notes', ''),
            'lastContact': datetime.now().strftime('%Y-%m-%d'),
            'createdAt': datetime.now().isoformat()
        }
        
        customers.append(new_customer)
        return new_customer
    
    def update_customer(self, customer_id, customer_data, data):
        """Update an existing customer"""
        customers = data.get('customers', [])
        for i, customer in enumerate(customers):
            if customer['id'] == customer_id:
                customers[i].update(customer_data)
                customers[i]['lastContact'] = datetime.now().strftime('%Y-%m-%d')
                return customers[i]
        return None
    
    def delete_customer(self, customer_id, data):
        """Delete a customer"""
        customers = data.get('customers', [])
        original_length = len(customers)
        data['customers'] = [c for c in customers if c['id'] != customer_id]
        return len(data['customers']) < original_length
    
    def create_opportunity(self, opp_data, data):
        """Create a new opportunity"""
        opportunities = data.setdefault('opportunities', [])
        new_id = max([o['id'] for o in opportunities], default=0) + 1
        
        new_opportunity = {
            'id': new_id,
            'company': opp_data.get('company', ''),
            'title': opp_data.get('title', ''),
            'value': opp_data.get('value', ''),
            'stage': opp_data.get('stage', 'prospecting'),
            'probability': opp_data.get('probability', '25%'),
            'closeDate': opp_data.get('closeDate', ''),
            'createdAt': datetime.now().isoformat()
        }
        
        opportunities.append(new_opportunity)
        return new_opportunity
    
    def create_activity(self, activity_data, data):
        """Create a new activity"""
        activities = data.setdefault('activities', [])
        new_id = max([a['id'] for a in activities], default=0) + 1
        
        new_activity = {
            'id': new_id,
            'type': activity_data.get('type', ''),
            'customer': activity_data.get('customer', ''),
            'subject': activity_data.get('subject', ''),
            'notes': activity_data.get('notes', ''),
            'date': activity_data.get('date', datetime.now().strftime('%Y-%m-%d')),
            'followUp': activity_data.get('followUp', False),
            'createdAt': datetime.now().isoformat()
        }
        
        activities.append(new_activity)
        return new_activity
    
    def load_data(self):
        """Load data from JSON file"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                pass
        
        # Return default data if file doesn't exist or is corrupted
        return self.get_default_data()
    
    def save_data(self, data):
        """Save data to JSON file"""
        with open(self.data_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_default_data(self):
        """Return default sample data"""
        return {
            "customers": [
                {
                    "id": 1,
                    "company": "Acme Corporation",
                    "contact": "John Davis",
                    "email": "john.davis@acme.com",
                    "phone": "+1 (555) 123-4567",
                    "industry": "Technology",
                    "status": "active",
                    "lastContact": "2024-06-28",
                    "jobTitle": "CTO",
                    "address": "123 Tech Street, San Francisco, CA 94102",
                    "revenue": "$5,000,000",
                    "employees": 150,
                    "notes": "Key decision maker for enterprise software purchases.",
                    "createdAt": "2024-01-15T10:30:00Z"
                },
                {
                    "id": 2,
                    "company": "TechStart Inc",
                    "contact": "Sarah Wilson",
                    "email": "sarah.wilson@techstart.com",
                    "phone": "+1 (555) 987-6543",
                    "industry": "Technology",
                    "status": "active",
                    "lastContact": "2024-06-30",
                    "jobTitle": "VP of Operations",
                    "address": "456 Innovation Ave, Austin, TX 78701",
                    "revenue": "$1,200,000",
                    "employees": 45,
                    "notes": "Startup with rapid growth.",
                    "createdAt": "2024-02-20T14:15:00Z"
                }
            ],
            "opportunities": [
                {
                    "id": 1,
                    "company": "Acme Corporation",
                    "title": "Enterprise Software License",
                    "value": "$125,000",
                    "stage": "proposal",
                    "probability": "75%",
                    "closeDate": "2024-08-15",
                    "createdAt": "2024-06-01T09:00:00Z"
                }
            ],
            "activities": [
                {
                    "id": 1,
                    "type": "Phone Call",
                    "customer": "Acme Corporation",
                    "subject": "Q4 Requirements Discussion",
                    "notes": "Discussed enterprise needs for Q4. Follow up required.",
                    "date": "2024-06-28",
                    "followUp": True,
                    "createdAt": "2024-06-28T15:30:00Z"
                }
            ]
        }
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def main():
    """Main server function"""
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8080.")
    
    # Change to the CRM directory to serve files correctly
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    server = HTTPServer(('localhost', port), CRMHandler)
    print(f"""
    ╔════════════════════════════════════════════╗
    ║            Nexus CRM Server                ║
    ╠════════════════════════════════════════════╣
    ║  Server running on: http://localhost:{port:<4} ║
    ║  CRM Application: http://localhost:{port}/    ║
    ║  API Endpoints:                            ║
    ║    • GET /api/customers                    ║
    ║    • POST /api/customers                   ║
    ║    • PUT /api/customers/{{id}}               ║
    ║    • DELETE /api/customers/{{id}}            ║
    ║                                            ║
    ║  Press Ctrl+C to stop the server          ║
    ╚════════════════════════════════════════════╝
    """)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\nShutting down the server...")
        server.shutdown()

if __name__ == '__main__':
    main()