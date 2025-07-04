#!/usr/bin/env python3
"""
Help Desk & Ticketing System Backend Server
A Python HTTP server that provides REST API endpoints for the help desk system.
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import sys
from datetime import datetime, timedelta
import uuid

# Sample data for Help Desk system
helpdesk_data = {
    "tickets": [
        {
            "id": "TKT-001",
            "subject": "Login Issues with Email Client",
            "status": "open",
            "priority": "high",
            "requester": "john.doe@nexuscorp.com",
            "agent": "Jane Smith",
            "created": "2024-01-15T09:30:00Z",
            "updated": "2024-01-15T10:15:00Z",
            "category": "software",
            "description": "Unable to connect to email server after password change",
            "resolution": None,
            "sla_due": "2024-01-15T13:30:00Z"
        },
        {
            "id": "TKT-002",
            "subject": "Printer Not Working in Conference Room",
            "status": "in-progress",
            "priority": "normal",
            "requester": "sarah.wilson@nexuscorp.com",
            "agent": "Mike Wilson",
            "created": "2024-01-15T11:45:00Z",
            "updated": "2024-01-15T14:20:00Z",
            "category": "hardware",
            "description": "Conference room printer shows offline status",
            "resolution": "Investigating network connectivity issues",
            "sla_due": "2024-01-16T11:45:00Z"
        },
        {
            "id": "TKT-003",
            "subject": "VPN Connection Timeout",
            "status": "urgent",
            "priority": "urgent",
            "requester": "david.chen@nexuscorp.com",
            "agent": "John Doe",
            "created": "2024-01-15T14:20:00Z",
            "updated": "2024-01-15T14:25:00Z",
            "category": "network",
            "description": "Cannot establish VPN connection from home office",
            "resolution": None,
            "sla_due": "2024-01-15T15:20:00Z"
        }
    ],
    "users": [
        {
            "name": "John Doe",
            "email": "john.doe@nexuscorp.com",
            "department": "Engineering",
            "role": "Senior Developer",
            "ticketsCreated": 12,
            "lastActive": "2024-01-15T14:30:00Z",
            "phone": "+1 (555) 123-4567",
            "location": "San Francisco, CA"
        },
        {
            "name": "Sarah Wilson",
            "email": "sarah.wilson@nexuscorp.com",
            "department": "Marketing",
            "role": "Marketing Manager",
            "ticketsCreated": 8,
            "lastActive": "2024-01-15T13:45:00Z",
            "phone": "+1 (555) 234-5678",
            "location": "New York, NY"
        },
        {
            "name": "David Chen",
            "email": "david.chen@nexuscorp.com",
            "department": "Sales",
            "role": "Sales Representative",
            "ticketsCreated": 15,
            "lastActive": "2024-01-15T16:20:00Z",
            "phone": "+1 (555) 345-6789",
            "location": "Chicago, IL"
        }
    ],
    "agents": [
        {
            "name": "Jane Smith",
            "email": "jane.smith@nexuscorp.com",
            "role": "Senior Support Agent",
            "specialties": ["software", "email"],
            "ticketsAssigned": 15,
            "ticketsResolved": 23,
            "avgResponseTime": "2.4",
            "status": "online"
        },
        {
            "name": "Mike Wilson",
            "email": "mike.wilson@nexuscorp.com",
            "role": "Hardware Specialist",
            "specialties": ["hardware", "network"],
            "ticketsAssigned": 12,
            "ticketsResolved": 19,
            "avgResponseTime": "3.1",
            "status": "online"
        },
        {
            "name": "John Doe",
            "email": "john.doe.support@nexuscorp.com",
            "role": "Network Administrator",
            "specialties": ["network", "security"],
            "ticketsAssigned": 8,
            "ticketsResolved": 15,
            "avgResponseTime": "2.8",
            "status": "away"
        }
    ],
    "knowledgeBase": [
        {
            "id": "KB-001",
            "title": "How to Reset Email Password",
            "category": "software",
            "content": "Step-by-step guide to reset your email password...",
            "tags": ["email", "password", "reset"],
            "views": 245,
            "rating": 4.5,
            "lastUpdated": "2024-01-10T10:00:00Z",
            "author": "Jane Smith"
        },
        {
            "id": "KB-002",
            "title": "VPN Setup Guide",
            "category": "network",
            "content": "Complete guide to setting up VPN connection...",
            "tags": ["vpn", "network", "remote"],
            "views": 189,
            "rating": 4.8,
            "lastUpdated": "2024-01-08T15:30:00Z",
            "author": "John Doe"
        },
        {
            "id": "KB-003",
            "title": "Printer Troubleshooting",
            "category": "hardware",
            "content": "Common printer issues and their solutions...",
            "tags": ["printer", "hardware", "troubleshooting"],
            "views": 156,
            "rating": 4.2,
            "lastUpdated": "2024-01-12T09:45:00Z",
            "author": "Mike Wilson"
        }
    ],
    "statistics": {
        "totalTickets": 247,
        "openTickets": 24,
        "urgentTickets": 3,
        "pendingTickets": 8,
        "resolvedThisMonth": 156,
        "avgResolutionTime": "4.2",
        "customerSatisfaction": 4.6,
        "slaCompliance": 94.2
    },
    "categories": [
        {"name": "hardware", "count": 45, "avgResolutionTime": "6.2"},
        {"name": "software", "count": 67, "avgResolutionTime": "3.8"},
        {"name": "network", "count": 32, "avgResolutionTime": "4.5"},
        {"name": "security", "count": 28, "avgResolutionTime": "2.1"},
        {"name": "access", "count": 41, "avgResolutionTime": "1.9"}
    ]
}

class HelpDeskRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path.startswith('/api/'):
            self.handle_api_request('GET', path, None)
        else:
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
        self.send_cors_headers()
        
        try:
            if path == '/api/tickets':
                if method == 'GET':
                    query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    filtered_tickets = self.filter_tickets(query_params)
                    self.send_json_response(filtered_tickets)
                elif method == 'POST':
                    new_ticket = self.create_ticket(data)
                    helpdesk_data['tickets'].append(new_ticket)
                    self.send_json_response(new_ticket, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path.startswith('/api/tickets/'):
                ticket_id = path.split('/')[-1]
                if method == 'GET':
                    ticket = self.find_ticket(ticket_id)
                    if ticket:
                        self.send_json_response(ticket)
                    else:
                        self.send_error(404, "Ticket not found")
                elif method == 'PUT':
                    ticket = self.update_ticket(ticket_id, data)
                    if ticket:
                        self.send_json_response(ticket)
                    else:
                        self.send_error(404, "Ticket not found")
                elif method == 'DELETE':
                    if self.delete_ticket(ticket_id):
                        self.send_json_response({"message": "Ticket deleted"})
                    else:
                        self.send_error(404, "Ticket not found")
            
            elif path == '/api/users':
                if method == 'GET':
                    self.send_json_response(helpdesk_data['users'])
                elif method == 'POST':
                    new_user = self.create_user(data)
                    helpdesk_data['users'].append(new_user)
                    self.send_json_response(new_user, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/agents':
                if method == 'GET':
                    self.send_json_response(helpdesk_data['agents'])
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/knowledge':
                if method == 'GET':
                    query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    filtered_kb = self.filter_knowledge_base(query_params)
                    self.send_json_response(filtered_kb)
                elif method == 'POST':
                    new_article = self.create_kb_article(data)
                    helpdesk_data['knowledgeBase'].append(new_article)
                    self.send_json_response(new_article, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/statistics':
                if method == 'GET':
                    stats = self.get_statistics()
                    self.send_json_response(stats)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/dashboard':
                if method == 'GET':
                    dashboard_data = self.get_dashboard_data()
                    self.send_json_response(dashboard_data)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/reports':
                if method == 'GET':
                    query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    report_data = self.generate_report(query_params)
                    self.send_json_response(report_data)
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
    
    def filter_tickets(self, query_params):
        tickets = helpdesk_data['tickets'].copy()
        
        status = query_params.get('status', [None])[0]
        priority = query_params.get('priority', [None])[0]
        agent = query_params.get('agent', [None])[0]
        search = query_params.get('search', [None])[0]
        
        if status:
            tickets = [t for t in tickets if t['status'] == status]
        
        if priority:
            tickets = [t for t in tickets if t['priority'] == priority]
        
        if agent:
            tickets = [t for t in tickets if t.get('agent') == agent]
        
        if search:
            search = search.lower()
            tickets = [t for t in tickets if 
                      search in t['subject'].lower() or 
                      search in t['id'].lower() or 
                      search in t['requester'].lower()]
        
        return tickets
    
    def create_ticket(self, data):
        ticket_id = f"TKT-{len(helpdesk_data['tickets']) + 1:03d}"
        
        return {
            "id": ticket_id,
            "subject": data.get('subject', ''),
            "status": "open",
            "priority": data.get('priority', 'normal'),
            "requester": data.get('requester', ''),
            "agent": None,
            "created": datetime.now().isoformat() + 'Z',
            "updated": datetime.now().isoformat() + 'Z',
            "category": data.get('category', 'general'),
            "description": data.get('description', ''),
            "resolution": None,
            "sla_due": self.calculate_sla_due(data.get('priority', 'normal'))
        }
    
    def calculate_sla_due(self, priority):
        hours_map = {'urgent': 1, 'high': 4, 'normal': 24, 'low': 48}
        hours = hours_map.get(priority, 24)
        due_date = datetime.now() + timedelta(hours=hours)
        return due_date.isoformat() + 'Z'
    
    def find_ticket(self, ticket_id):
        return next((t for t in helpdesk_data['tickets'] if t['id'] == ticket_id), None)
    
    def update_ticket(self, ticket_id, data):
        ticket = self.find_ticket(ticket_id)
        if ticket:
            ticket.update(data)
            ticket['updated'] = datetime.now().isoformat() + 'Z'
            return ticket
        return None
    
    def delete_ticket(self, ticket_id):
        ticket = self.find_ticket(ticket_id)
        if ticket:
            helpdesk_data['tickets'].remove(ticket)
            return True
        return False
    
    def create_user(self, data):
        return {
            "name": data.get('name', ''),
            "email": data.get('email', ''),
            "department": data.get('department', ''),
            "role": data.get('role', ''),
            "ticketsCreated": 0,
            "lastActive": datetime.now().isoformat() + 'Z',
            "phone": data.get('phone', ''),
            "location": data.get('location', '')
        }
    
    def filter_knowledge_base(self, query_params):
        articles = helpdesk_data['knowledgeBase'].copy()
        
        category = query_params.get('category', [None])[0]
        search = query_params.get('search', [None])[0]
        
        if category:
            articles = [a for a in articles if a['category'] == category]
        
        if search:
            search = search.lower()
            articles = [a for a in articles if 
                       search in a['title'].lower() or 
                       search in a['content'].lower()]
        
        return articles
    
    def create_kb_article(self, data):
        article_id = f"KB-{len(helpdesk_data['knowledgeBase']) + 1:03d}"
        
        return {
            "id": article_id,
            "title": data.get('title', ''),
            "category": data.get('category', 'general'),
            "content": data.get('content', ''),
            "tags": data.get('tags', []),
            "views": 0,
            "rating": 0,
            "lastUpdated": datetime.now().isoformat() + 'Z',
            "author": data.get('author', 'System')
        }
    
    def get_statistics(self):
        tickets = helpdesk_data['tickets']
        
        return {
            "totalTickets": len(tickets),
            "openTickets": len([t for t in tickets if t['status'] == 'open']),
            "urgentTickets": len([t for t in tickets if t['priority'] == 'urgent']),
            "pendingTickets": len([t for t in tickets if t['status'] == 'pending']),
            "resolvedThisMonth": helpdesk_data['statistics']['resolvedThisMonth'],
            "avgResolutionTime": helpdesk_data['statistics']['avgResolutionTime'],
            "customerSatisfaction": helpdesk_data['statistics']['customerSatisfaction'],
            "slaCompliance": helpdesk_data['statistics']['slaCompliance']
        }
    
    def get_dashboard_data(self):
        return {
            "statistics": self.get_statistics(),
            "recentTickets": helpdesk_data['tickets'][:5],
            "agentPerformance": helpdesk_data['agents'],
            "topCategories": helpdesk_data['categories'][:5],
            "alerts": [
                {
                    "type": "urgent",
                    "message": f"{len([t for t in helpdesk_data['tickets'] if t['priority'] == 'urgent'])} urgent tickets require immediate attention",
                    "timestamp": datetime.now().isoformat() + 'Z'
                }
            ]
        }
    
    def generate_report(self, query_params):
        period = query_params.get('period', ['month'])[0]
        report_type = query_params.get('type', ['summary'])[0]
        
        return {
            "period": period,
            "type": report_type,
            "generated": datetime.now().isoformat() + 'Z',
            "data": {
                "ticketVolume": [45, 52, 48, 61, 58, 65],
                "resolutionTimes": [15, 28, 12, 5],
                "satisfactionScores": [4.2, 4.5, 4.8, 4.6, 4.7],
                "categoryBreakdown": helpdesk_data['categories']
            }
        }
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

def main():
    port = 8002
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8002.")
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    handler = HelpDeskRequestHandler
    httpd = socketserver.TCPServer(("", port), handler)
    
    print(f"Help Desk & Ticketing System server starting on port {port}")
    print(f"Access the application at: http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()

if __name__ == "__main__":
    main()