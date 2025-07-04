#!/usr/bin/env python3
"""
Human Resources Management System Backend Server
A Python HTTP server that provides REST API endpoints for the HR system.
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import sys
from datetime import datetime, timedelta
import uuid

# Sample data for HR system
hr_data = {
    "employees": [
        {
            "id": "EMP001",
            "firstName": "John",
            "lastName": "Smith",
            "email": "john.smith@nexuscorp.com",
            "phone": "+1 (555) 123-4567",
            "department": "engineering",
            "position": "Senior Software Engineer",
            "hireDate": "2021-03-15",
            "salary": 125000,
            "status": "active",
            "location": "san-francisco",
            "manager": "Sarah Wilson",
            "performanceRating": 4.5,
            "benefits": {
                "healthInsurance": "Premium Plan",
                "dentalInsurance": True,
                "visionInsurance": True,
                "retirement401k": True,
                "ptoBalance": 18
            }
        },
        {
            "id": "EMP002",
            "firstName": "Sarah",
            "lastName": "Wilson",
            "email": "sarah.wilson@nexuscorp.com",
            "phone": "+1 (555) 234-5678",
            "department": "engineering",
            "position": "Engineering Manager",
            "hireDate": "2020-01-22",
            "salary": 145000,
            "status": "active",
            "location": "san-francisco",
            "manager": "David Chen",
            "performanceRating": 4.8,
            "benefits": {
                "healthInsurance": "Premium Plan",
                "dentalInsurance": True,
                "visionInsurance": True,
                "retirement401k": True,
                "ptoBalance": 22
            }
        },
        {
            "id": "EMP003",
            "firstName": "Mike",
            "lastName": "Davis",
            "email": "mike.davis@nexuscorp.com",
            "phone": "+1 (555) 345-6789",
            "department": "sales",
            "position": "Sales Representative",
            "hireDate": "2022-06-10",
            "salary": 75000,
            "status": "active",
            "location": "new-york",
            "manager": "Jennifer Lee",
            "performanceRating": 4.2,
            "benefits": {
                "healthInsurance": "Basic Plan",
                "dentalInsurance": True,
                "visionInsurance": False,
                "retirement401k": True,
                "ptoBalance": 15
            }
        }
    ],
    "candidates": [
        {
            "id": "CND001",
            "firstName": "Alex",
            "lastName": "Johnson",
            "email": "alex.johnson@email.com",
            "phone": "+1 (555) 111-2222",
            "position": "Software Engineer",
            "stage": "applied",
            "score": 85,
            "appliedDate": "2024-01-10",
            "source": "LinkedIn",
            "resume": "alex_johnson_resume.pdf"
        },
        {
            "id": "CND002",
            "firstName": "Maria",
            "lastName": "Garcia",
            "email": "maria.garcia@email.com",
            "phone": "+1 (555) 333-4444",
            "position": "Product Manager",
            "stage": "screening",
            "score": 92,
            "appliedDate": "2024-01-08",
            "source": "Company Website",
            "resume": "maria_garcia_resume.pdf"
        }
    ],
    "jobPostings": [
        {
            "id": "JOB001",
            "title": "Senior Software Engineer",
            "department": "engineering",
            "location": "san-francisco",
            "type": "full-time",
            "status": "active",
            "postedDate": "2024-01-05",
            "applications": 25,
            "description": "We are looking for a senior software engineer...",
            "requirements": ["5+ years experience", "Python", "React", "AWS"],
            "salary": {"min": 120000, "max": 160000}
        },
        {
            "id": "JOB002",
            "title": "Product Manager",
            "department": "product",
            "location": "remote",
            "type": "full-time",
            "status": "active",
            "postedDate": "2024-01-03",
            "applications": 18,
            "description": "Seeking an experienced product manager...",
            "requirements": ["3+ years PM experience", "Agile", "Analytics"],
            "salary": {"min": 100000, "max": 140000}
        }
    ],
    "performanceReviews": [
        {
            "id": "REV001",
            "employeeId": "EMP001",
            "reviewerId": "EMP002",
            "period": "2023-Q4",
            "status": "completed",
            "rating": 4.5,
            "goals": [
                {"goal": "Improve code quality", "status": "achieved"},
                {"goal": "Mentor junior developers", "status": "achieved"},
                {"goal": "Complete certification", "status": "in-progress"}
            ],
            "feedback": "Excellent performance this quarter...",
            "dateCompleted": "2024-01-15"
        }
    ],
    "payroll": {
        "currentPeriod": "2024-01",
        "totalCost": 1456780,
        "breakdown": {
            "salaries": 1200000,
            "benefits": 234120,
            "taxes": 392450,
            "other": 89760
        },
        "upcomingPaydays": [
            {"date": "2024-01-31", "type": "monthly", "amount": 1456780},
            {"date": "2024-02-15", "type": "bi-weekly", "amount": 728390},
            {"date": "2024-02-29", "type": "monthly", "amount": 1478920}
        ]
    },
    "benefits": {
        "healthInsurance": {
            "premiumPlan": {"enrollment": 89, "cost": 450},
            "basicPlan": {"enrollment": 11, "cost": 200}
        },
        "dentalInsurance": {"enrollment": 76, "cost": 25},
        "visionInsurance": {"enrollment": 82, "cost": 15},
        "retirement401k": {"participation": 65, "companyMatch": 4},
        "lifeInsurance": {"enrollment": 94, "cost": 0},
        "flexSpending": {"participation": 45, "avgContribution": 1200}
    },
    "analytics": {
        "totalEmployees": 247,
        "newHires": 12,
        "turnoverRate": 8.5,
        "satisfactionScore": 4.2,
        "openPositions": 15,
        "avgSalary": 89500,
        "departmentCounts": {
            "engineering": 85,
            "sales": 65,
            "marketing": 42,
            "hr": 25,
            "finance": 30
        },
        "attendanceRate": 94.5,
        "avgPerformanceRating": 4.2
    }
}

class HRRequestHandler(http.server.SimpleHTTPRequestHandler):
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
            if path == '/api/employees':
                if method == 'GET':
                    query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    filtered_employees = self.filter_employees(query_params)
                    self.send_json_response(filtered_employees)
                elif method == 'POST':
                    new_employee = self.create_employee(data)
                    hr_data['employees'].append(new_employee)
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
            
            elif path == '/api/candidates':
                if method == 'GET':
                    query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    filtered_candidates = self.filter_candidates(query_params)
                    self.send_json_response(filtered_candidates)
                elif method == 'POST':
                    new_candidate = self.create_candidate(data)
                    hr_data['candidates'].append(new_candidate)
                    self.send_json_response(new_candidate, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/job-postings':
                if method == 'GET':
                    self.send_json_response(hr_data['jobPostings'])
                elif method == 'POST':
                    new_job = self.create_job_posting(data)
                    hr_data['jobPostings'].append(new_job)
                    self.send_json_response(new_job, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/performance-reviews':
                if method == 'GET':
                    query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    employee_id = query_params.get('employeeId', [None])[0]
                    if employee_id:
                        reviews = [r for r in hr_data['performanceReviews'] if r['employeeId'] == employee_id]
                        self.send_json_response(reviews)
                    else:
                        self.send_json_response(hr_data['performanceReviews'])
                elif method == 'POST':
                    new_review = self.create_performance_review(data)
                    hr_data['performanceReviews'].append(new_review)
                    self.send_json_response(new_review, 201)
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/payroll':
                if method == 'GET':
                    self.send_json_response(hr_data['payroll'])
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/benefits':
                if method == 'GET':
                    self.send_json_response(hr_data['benefits'])
                else:
                    self.send_error(405, "Method Not Allowed")
            
            elif path == '/api/analytics':
                if method == 'GET':
                    analytics = self.get_analytics()
                    self.send_json_response(analytics)
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
                    report_data = self.generate_hr_report(query_params)
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
    
    def filter_employees(self, query_params):
        employees = hr_data['employees'].copy()
        
        department = query_params.get('department', [None])[0]
        status = query_params.get('status', [None])[0]
        location = query_params.get('location', [None])[0]
        search = query_params.get('search', [None])[0]
        
        if department:
            employees = [e for e in employees if e['department'] == department]
        
        if status:
            employees = [e for e in employees if e['status'] == status]
        
        if location:
            employees = [e for e in employees if e['location'] == location]
        
        if search:
            search = search.lower()
            employees = [e for e in employees if 
                        search in f"{e['firstName']} {e['lastName']}".lower() or 
                        search in e['email'].lower() or 
                        search in e['id'].lower()]
        
        return employees
    
    def create_employee(self, data):
        employee_id = f"EMP{len(hr_data['employees']) + 1:03d}"
        
        return {
            "id": employee_id,
            "firstName": data.get('firstName', ''),
            "lastName": data.get('lastName', ''),
            "email": data.get('email', ''),
            "phone": data.get('phone', ''),
            "department": data.get('department', ''),
            "position": data.get('position', ''),
            "hireDate": data.get('hireDate', datetime.now().strftime('%Y-%m-%d')),
            "salary": data.get('salary', 0),
            "status": "active",
            "location": data.get('location', 'san-francisco'),
            "manager": data.get('manager', ''),
            "performanceRating": 0,
            "benefits": {
                "healthInsurance": "Basic Plan",
                "dentalInsurance": False,
                "visionInsurance": False,
                "retirement401k": False,
                "ptoBalance": 15
            }
        }
    
    def find_employee(self, employee_id):
        return next((e for e in hr_data['employees'] if e['id'] == employee_id), None)
    
    def update_employee(self, employee_id, data):
        employee = self.find_employee(employee_id)
        if employee:
            employee.update(data)
            return employee
        return None
    
    def delete_employee(self, employee_id):
        employee = self.find_employee(employee_id)
        if employee:
            hr_data['employees'].remove(employee)
            return True
        return False
    
    def filter_candidates(self, query_params):
        candidates = hr_data['candidates'].copy()
        
        stage = query_params.get('stage', [None])[0]
        position = query_params.get('position', [None])[0]
        
        if stage:
            candidates = [c for c in candidates if c['stage'] == stage]
        
        if position:
            candidates = [c for c in candidates if position.lower() in c['position'].lower()]
        
        return candidates
    
    def create_candidate(self, data):
        candidate_id = f"CND{len(hr_data['candidates']) + 1:03d}"
        
        return {
            "id": candidate_id,
            "firstName": data.get('firstName', ''),
            "lastName": data.get('lastName', ''),
            "email": data.get('email', ''),
            "phone": data.get('phone', ''),
            "position": data.get('position', ''),
            "stage": "applied",
            "score": 0,
            "appliedDate": datetime.now().strftime('%Y-%m-%d'),
            "source": data.get('source', 'Website'),
            "resume": data.get('resume', '')
        }
    
    def create_job_posting(self, data):
        job_id = f"JOB{len(hr_data['jobPostings']) + 1:03d}"
        
        return {
            "id": job_id,
            "title": data.get('title', ''),
            "department": data.get('department', ''),
            "location": data.get('location', ''),
            "type": data.get('type', 'full-time'),
            "status": "active",
            "postedDate": datetime.now().strftime('%Y-%m-%d'),
            "applications": 0,
            "description": data.get('description', ''),
            "requirements": data.get('requirements', []),
            "salary": data.get('salary', {"min": 0, "max": 0})
        }
    
    def create_performance_review(self, data):
        review_id = f"REV{len(hr_data['performanceReviews']) + 1:03d}"
        
        return {
            "id": review_id,
            "employeeId": data.get('employeeId', ''),
            "reviewerId": data.get('reviewerId', ''),
            "period": data.get('period', ''),
            "status": "pending",
            "rating": data.get('rating', 0),
            "goals": data.get('goals', []),
            "feedback": data.get('feedback', ''),
            "dateCompleted": None
        }
    
    def get_analytics(self):
        employees = hr_data['employees']
        
        # Calculate real-time analytics
        total_employees = len(employees)
        active_employees = len([e for e in employees if e['status'] == 'active'])
        avg_salary = sum(e['salary'] for e in employees) / total_employees if total_employees > 0 else 0
        
        department_counts = {}
        for emp in employees:
            dept = emp['department']
            department_counts[dept] = department_counts.get(dept, 0) + 1
        
        return {
            "totalEmployees": total_employees,
            "activeEmployees": active_employees,
            "newHires": hr_data['analytics']['newHires'],
            "turnoverRate": hr_data['analytics']['turnoverRate'],
            "satisfactionScore": hr_data['analytics']['satisfactionScore'],
            "openPositions": len(hr_data['jobPostings']),
            "avgSalary": avg_salary,
            "departmentCounts": department_counts,
            "attendanceRate": hr_data['analytics']['attendanceRate'],
            "avgPerformanceRating": hr_data['analytics']['avgPerformanceRating']
        }
    
    def get_dashboard_data(self):
        return {
            "analytics": self.get_analytics(),
            "recentHires": sorted(hr_data['employees'], key=lambda x: x['hireDate'], reverse=True)[:5],
            "upcomingReviews": [
                {"employeeId": "EMP001", "name": "John Smith", "date": "2024-01-20", "type": "Annual Review"},
                {"employeeId": "EMP002", "name": "Sarah Wilson", "date": "2024-01-22", "type": "Quarterly Check-in"}
            ],
            "alerts": [
                {
                    "type": "info",
                    "message": f"{len([j for j in hr_data['jobPostings'] if j['status'] == 'active'])} active job postings",
                    "timestamp": datetime.now().isoformat()
                }
            ]
        }
    
    def generate_hr_report(self, query_params):
        report_type = query_params.get('type', ['summary'])[0]
        period = query_params.get('period', ['month'])[0]
        
        return {
            "type": report_type,
            "period": period,
            "generated": datetime.now().isoformat(),
            "data": {
                "employeeCount": len(hr_data['employees']),
                "payrollCost": hr_data['payroll']['totalCost'],
                "turnoverRate": hr_data['analytics']['turnoverRate'],
                "satisfactionScore": hr_data['analytics']['satisfactionScore'],
                "openPositions": len(hr_data['jobPostings']),
                "departmentBreakdown": hr_data['analytics']['departmentCounts']
            }
        }
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

def main():
    port = 8003
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8003.")
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    handler = HRRequestHandler
    httpd = socketserver.TCPServer(("", port), handler)
    
    print(f"Human Resources Management System server starting on port {port}")
    print(f"Access the application at: http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()

if __name__ == "__main__":
    main()