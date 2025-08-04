#!/usr/bin/env python3
"""
Simple Python server for Nexus Expenses application
Provides basic CRUD operations with JSON file storage
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
import urllib.parse
from datetime import datetime
import sys

class ExpensesHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.data_file = 'expenses_data.json'
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path.startswith('/api/'):
            self.handle_api_get()
        elif self.path.startswith('/receipts/'):
            self.handle_receipt_download()
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
            if self.path == '/api/expenses':
                self.get_all_expenses()
            elif self.path.startswith('/api/expenses/'):
                expense_id = self.path.split('/')[-1]
                self.get_expense(expense_id)
            elif self.path == '/api/stats':
                self.get_dashboard_stats()
            else:
                self.send_error(404)
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
    def handle_api_post(self):
        """Handle API POST requests"""
        try:
            if self.path == '/api/expenses':
                self.create_expense()
            elif self.path.endswith('/approve'):
                expense_id = self.path.split('/')[-2]
                self.approve_expense(expense_id)
            elif self.path.endswith('/reject'):
                expense_id = self.path.split('/')[-2]
                self.reject_expense(expense_id)
            else:
                self.send_error(404)
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
    def handle_api_put(self):
        """Handle API PUT requests"""
        try:
            if self.path.startswith('/api/expenses/'):
                expense_id = self.path.split('/')[-1]
                self.update_expense(expense_id)
            else:
                self.send_error(404)
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
    def handle_api_delete(self):
        """Handle API DELETE requests"""
        try:
            if self.path.startswith('/api/expenses/'):
                expense_id = self.path.split('/')[-1]
                self.delete_expense(expense_id)
            else:
                self.send_error(404)
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
    def handle_receipt_download(self):
        """Handle receipt download requests"""
        try:
            filename = self.path.split('/')[-1]
            file_path = os.path.join('mock', filename)
            
            # Check if file exists
            if not os.path.exists(file_path):
                self.send_error(404, f'Receipt file {filename} not found')
                return
            
            # Serve the actual PDF file
            self.send_response(200)
            self.send_header('Content-Type', 'application/pdf')
            self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
            
            # Get file size for Content-Length header
            file_size = os.path.getsize(file_path)
            self.send_header('Content-Length', str(file_size))
            self.end_headers()
            
            # Send the actual file content
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def get_all_expenses(self):
        """Get all expenses"""
        data = self.load_data()
        self.send_json_response(data)
    
    def get_expense(self, expense_id):
        """Get specific expense"""
        data = self.load_data()
        
        # Search in all status categories
        for status in ['pending', 'approved', 'rejected']:
            expense = next((e for e in data.get(status, []) if str(e['id']) == expense_id), None)
            if expense:
                self.send_json_response(expense)
                return
        
        self.send_error(404, 'Expense not found')
    
    def get_dashboard_stats(self):
        """Get dashboard statistics"""
        data = self.load_data()
        
        pending_count = len(data.get('pending', []))
        pending_amount = sum(e['amount'] for e in data.get('pending', []))
        approved_count = len(data.get('approved', []))
        rejected_count = len(data.get('rejected', []))
        
        stats = {
            'pending_count': pending_count,
            'pending_amount': pending_amount,
            'approved_count': approved_count,
            'rejected_count': rejected_count,
            'total_processed': approved_count + rejected_count,
            'approval_rate': (approved_count / max(approved_count + rejected_count, 1)) * 100
        }
        
        self.send_json_response(stats)
    
    def create_expense(self):
        """Create new expense"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            expense_data = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON')
            return
        
        data = self.load_data()
        
        # Generate new ID
        all_expenses = []
        for status in ['pending', 'approved', 'rejected']:
            all_expenses.extend(data.get(status, []))
        
        new_id = max([e['id'] for e in all_expenses], default=0) + 1
        
        # Add metadata
        expense_data['id'] = new_id
        expense_data['status'] = 'pending'
        expense_data['submittedDate'] = datetime.now().strftime('%Y-%m-%d')
        
        # Add to pending expenses
        if 'pending' not in data:
            data['pending'] = []
        data['pending'].append(expense_data)
        
        self.save_data(data)
        self.send_json_response(expense_data, 201)
    
    def approve_expense(self, expense_id):
        """Approve an expense"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            approval_data = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            approval_data = {}
        
        data = self.load_data()
        
        # Find expense in pending
        expense = None
        for i, e in enumerate(data.get('pending', [])):
            if str(e['id']) == expense_id:
                expense = data['pending'].pop(i)
                break
        
        if not expense:
            self.send_error(404, 'Expense not found in pending list')
            return
        
        # Move to approved
        expense['status'] = 'approved'
        expense['approvedDate'] = datetime.now().strftime('%Y-%m-%d')
        expense['approvedBy'] = approval_data.get('approvedBy', 'Sarah Johnson')
        expense['comments'] = approval_data.get('comments', 'Approved after validation review.')
        
        if 'approved' not in data:
            data['approved'] = []
        data['approved'].insert(0, expense)
        
        self.save_data(data)
        self.send_json_response(expense)
    
    def reject_expense(self, expense_id):
        """Reject an expense"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            rejection_data = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            self.send_error(400, 'Comments required for rejection')
            return
        
        if not rejection_data.get('comments'):
            self.send_error(400, 'Comments required for rejection')
            return
        
        data = self.load_data()
        
        # Find expense in pending
        expense = None
        for i, e in enumerate(data.get('pending', [])):
            if str(e['id']) == expense_id:
                expense = data['pending'].pop(i)
                break
        
        if not expense:
            self.send_error(404, 'Expense not found in pending list')
            return
        
        # Move to rejected
        expense['status'] = 'rejected'
        expense['rejectedDate'] = datetime.now().strftime('%Y-%m-%d')
        expense['rejectedBy'] = rejection_data.get('rejectedBy', 'Sarah Johnson')
        expense['comments'] = rejection_data['comments']
        
        if 'rejected' not in data:
            data['rejected'] = []
        data['rejected'].insert(0, expense)
        
        self.save_data(data)
        self.send_json_response(expense)
    
    def update_expense(self, expense_id):
        """Update expense"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            update_data = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON')
            return
        
        data = self.load_data()
        
        # Find and update expense
        for status in ['pending', 'approved', 'rejected']:
            for i, expense in enumerate(data.get(status, [])):
                if str(expense['id']) == expense_id:
                    # Update fields
                    for key, value in update_data.items():
                        if key != 'id':  # Don't allow ID changes
                            expense[key] = value
                    
                    self.save_data(data)
                    self.send_json_response(expense)
                    return
        
        self.send_error(404, 'Expense not found')
    
    def delete_expense(self, expense_id):
        """Delete expense"""
        data = self.load_data()
        
        # Find and remove expense
        for status in ['pending', 'approved', 'rejected']:
            for i, expense in enumerate(data.get(status, [])):
                if str(expense['id']) == expense_id:
                    deleted_expense = data[status].pop(i)
                    self.save_data(data)
                    self.send_json_response({'message': 'Expense deleted', 'expense': deleted_expense})
                    return
        
        self.send_error(404, 'Expense not found')
    
    def load_data(self):
        """Load data from JSON file"""
        if not os.path.exists(self.data_file):
            # Initialize with sample data
            sample_data = {
                "pending": [
                    {
                        "id": 1,
                        "employee": "Jens W.",
                        "amount": 2254.00,
                        "currency": "USD",
                        "category": "Travel",
                        "description": "Hotel accommodation - The Palazzo Las Vegas (7-night stay)",
                        "date": "2019-12-01",
                        "submittedDate": "2024-01-12",
                        "receipt": "example2.pdf",
                        "status": "pending",
                        "priority": "high",
                        "notes": "Business trip accommodation with room upgrades and resort fees. Reservation #436056301543"
                    },
                    {
                        "id": 2,
                        "employee": "Jens W.",
                        "amount": 86.75,
                        "currency": "EUR",
                        "category": "Travel",
                        "description": "ICE train ticket Hamburg to Bonn (first class)",
                        "date": "2017-11-24",
                        "submittedDate": "2024-01-13",
                        "receipt": "example1.pdf",
                        "status": "pending",
                        "priority": "medium",
                        "notes": "Deutsche Bahn ticket with seat reservation. Order number: EN97RX"
                    },
                    {
                        "id": 3,
                        "employee": "Jens W.",
                        "amount": 26.45,
                        "currency": "PLN",
                        "category": "Meals",
                        "description": "Coffee and beverages - Finest Coffee, Wrocław",
                        "date": "2020-02-25",
                        "submittedDate": "2024-01-11",
                        "receipt": "example3.pdf",
                        "status": "pending",
                        "priority": "low",
                        "notes": "Business meeting refreshments at Pl. Grunwaldzki 15-27, Wrocław, Poland"
                    },
                    {
                        "id": 4,
                        "employee": "Jens W.",
                        "amount": 43.90,
                        "currency": "EUR",
                        "category": "Transportation",
                        "description": "Diesel fuel purchase - 34.87 liters",
                        "date": "2021-03-19",
                        "submittedDate": "2024-01-14",
                        "receipt": "example4.pdf",
                        "status": "pending",
                        "priority": "low",
                        "notes": "Star Tankstelle, Leipzig. Business travel fuel expense"
                    }
                ],
                "approved": [
                    {
                        "id": 101,
                        "employee": "John Smith",
                        "amount": 1245.00,
                        "currency": "USD",
                        "category": "Travel",
                        "description": "Business trip to Chicago - Client meetings",
                        "date": "2024-01-08",
                        "approvedDate": "2024-01-10",
                        "receipt": "travel_expenses.pdf",
                        "status": "approved",
                        "approvedBy": "Sarah Johnson",
                        "comments": "All documentation complete. Valid business purpose."
                    }
                ],
                "rejected": [
                    {
                        "id": 201,
                        "employee": "Mike Davis",
                        "amount": 89.50,
                        "currency": "USD",
                        "category": "Meals",
                        "description": "Business dinner",
                        "date": "2024-01-09",
                        "rejectedDate": "2024-01-11",
                        "receipt": "restaurant_receipt_2.pdf",
                        "status": "rejected",
                        "rejectedBy": "Sarah Johnson",
                        "comments": "Exceeds daily meal allowance limit of $75. Please resubmit with valid amount."
                    }
                ]
            }
            self.save_data(sample_data)
            return sample_data
        
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {"pending": [], "approved": [], "rejected": []}
    
    def save_data(self, data):
        """Save data to JSON file"""
        try:
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving data: {e}")
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        json_string = json.dumps(data, indent=2)
        self.wfile.write(json_string.encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server(port=8000):
    """Run the HTTP server"""
    try:
        server_address = ('', port)
        httpd = HTTPServer(server_address, ExpensesHandler)
        print(f"Nexus Expenses server running on http://localhost:{port}")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user")
        httpd.shutdown()
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port)