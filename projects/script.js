// Project Management System JavaScript
class ProjectManagement {
    constructor() {
        this.projects = [];
        this.tasks = [];
        this.resources = [];
        this.currentTab = 'dashboard';
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.renderDashboard();
        this.setupNavigation();
    }

    loadSampleData() {
        this.projects = [
            {
                id: 1,
                name: 'Website Redesign',
                code: 'WR-2024-001',
                description: 'Complete redesign of corporate website with modern UX/UI',
                status: 'active',
                priority: 'high',
                manager: 'sarah-wilson',
                startDate: '2024-01-15',
                endDate: '2024-03-15',
                budget: 50000,
                client: 'Internal',
                progress: 65
            },
            {
                id: 2,
                name: 'Mobile App Development',
                code: 'MAD-2024-002',
                description: 'Native iOS and Android app for customer portal',
                status: 'planning',
                priority: 'critical',
                manager: 'mike-chen',
                startDate: '2024-02-01',
                endDate: '2024-06-01',
                budget: 120000,
                client: 'ABC Corp',
                progress: 15
            },
            {
                id: 3,
                name: 'Data Migration',
                code: 'DM-2024-003',
                description: 'Migrate legacy systems to cloud infrastructure',
                status: 'active',
                priority: 'medium',
                manager: 'emily-davis',
                startDate: '2024-01-01',
                endDate: '2024-04-01',
                budget: 75000,
                client: 'XYZ Inc',
                progress: 80
            }
        ];

        this.tasks = [
            {
                id: 1,
                title: 'Design wireframes',
                description: 'Create detailed wireframes for all pages',
                projectId: 1,
                status: 'done',
                assignee: 'john-smith',
                priority: 'high',
                dueDate: '2024-02-01',
                estimatedHours: 20
            },
            {
                id: 2,
                title: 'Develop frontend',
                description: 'Implement responsive UI components',
                projectId: 1,
                status: 'in-progress',
                assignee: 'sarah-wilson',
                priority: 'high',
                dueDate: '2024-02-15',
                estimatedHours: 60
            },
            {
                id: 3,
                title: 'API Integration',
                description: 'Connect frontend with backend APIs',
                projectId: 2,
                status: 'todo',
                assignee: 'mike-chen',
                priority: 'medium',
                dueDate: '2024-03-01',
                estimatedHours: 40
            }
        ];

        this.resources = [
            {
                id: 1,
                name: 'John Smith',
                role: 'Frontend Developer',
                currentProject: 'Website Redesign',
                utilization: 85,
                availability: 'Available',
                costPerHour: 75
            },
            {
                id: 2,
                name: 'Sarah Wilson',
                role: 'Project Manager',
                currentProject: 'Website Redesign',
                utilization: 90,
                availability: 'Busy',
                costPerHour: 95
            },
            {
                id: 3,
                name: 'Mike Chen',
                role: 'Full Stack Developer',
                currentProject: 'Mobile App Development',
                utilization: 70,
                availability: 'Available',
                costPerHour: 85
            }
        ];
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        document.getElementById('project-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createProject();
        });

        document.getElementById('task-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });

        document.getElementById('status-filter')?.addEventListener('change', () => {
            this.filterProjects();
        });

        document.getElementById('priority-filter')?.addEventListener('change', () => {
            this.filterProjects();
        });

        document.getElementById('manager-filter')?.addEventListener('change', () => {
            this.filterProjects();
        });

        document.getElementById('project-search')?.addEventListener('input', () => {
            this.filterProjects();
        });
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        switch(tabName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'projects':
                this.renderProjects();
                break;
            case 'tasks':
                this.renderTasks();
                break;
            case 'gantt':
                this.renderGantt();
                break;
            case 'resources':
                this.renderResources();
                break;
            case 'calendar':
                this.renderCalendar();
                break;
            case 'reports':
                this.renderReports();
                break;
        }
    }

    renderDashboard() {
        this.renderProjectOverview();
        this.renderUpcomingDeadlines();
        this.renderRecentActivity();
    }

    renderProjectOverview() {
        const container = document.getElementById('project-overview');
        if (!container) return;

        container.innerHTML = this.projects.slice(0, 5).map(project => `
            <div class="project-item">
                <div class="project-info">
                    <div class="project-name">${project.name}</div>
                    <div class="project-details">${project.code} • ${project.client}</div>
                </div>
                <div class="project-status ${project.status}">${this.formatStatus(project.status)}</div>
            </div>
        `).join('');
    }

    renderUpcomingDeadlines() {
        const container = document.getElementById('upcoming-deadlines');
        if (!container) return;

        const upcomingTasks = this.tasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            const timeDiff = dueDate - today;
            return timeDiff > 0 && timeDiff <= 7 * 24 * 60 * 60 * 1000;
        });

        container.innerHTML = upcomingTasks.map(task => `
            <div class="deadline-item">
                <div class="deadline-info">
                    <div class="deadline-task">${task.title}</div>
                    <div class="deadline-date">Due: ${this.formatDate(task.dueDate)}</div>
                </div>
                <div class="priority-badge ${task.priority}">${this.formatPriority(task.priority)}</div>
            </div>
        `).join('');
    }

    renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        const activities = [
            { title: 'Project "Website Redesign" updated', time: '2 hours ago' },
            { title: 'Task "API Integration" assigned to Mike Chen', time: '4 hours ago' },
            { title: 'New project "Mobile App Development" created', time: '1 day ago' },
            { title: 'Resource "John Smith" availability changed', time: '2 days ago' }
        ];

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-info">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    renderProjects() {
        const container = document.getElementById('project-grid');
        if (!container) return;

        container.innerHTML = this.projects.map(project => `
            <div class="project-card" onclick="editProject(${project.id})">
                <div class="project-card-header">
                    <div>
                        <div class="project-title">${project.name}</div>
                        <div class="project-code">${project.code}</div>
                    </div>
                    <div class="priority-badge ${project.priority}">${this.formatPriority(project.priority)}</div>
                </div>
                <div class="project-description">${project.description}</div>
                <div class="project-progress">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>
                <div class="project-meta">
                    <span>Manager: ${this.getManagerName(project.manager)}</span>
                    <span class="project-status ${project.status}">${this.formatStatus(project.status)}</span>
                </div>
            </div>
        `).join('');
    }

    renderTasks() {
        const todoTasks = this.tasks.filter(task => task.status === 'todo');
        const inProgressTasks = this.tasks.filter(task => task.status === 'in-progress');
        const reviewTasks = this.tasks.filter(task => task.status === 'review');
        const doneTasks = this.tasks.filter(task => task.status === 'done');

        this.renderTaskColumn('todo-tasks', todoTasks);
        this.renderTaskColumn('inprogress-tasks', inProgressTasks);
        this.renderTaskColumn('review-tasks', reviewTasks);
        this.renderTaskColumn('done-tasks', doneTasks);
    }

    renderTaskColumn(containerId, tasks) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = tasks.map(task => `
            <div class="task-card" onclick="editTask(${task.id})">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span>Due: ${this.formatDate(task.dueDate)}</span>
                    <span class="task-assignee">${this.getAssigneeName(task.assignee)}</span>
                </div>
            </div>
        `).join('');
    }

    renderGantt() {
        const container = document.getElementById('gantt-chart');
        if (!container) return;

        const timeline = document.getElementById('gantt-timeline');
        if (timeline) {
            timeline.innerHTML = `
                <div class="timeline-item">Jan 2024</div>
                <div class="timeline-item">Feb 2024</div>
                <div class="timeline-item">Mar 2024</div>
                <div class="timeline-item">Apr 2024</div>
                <div class="timeline-item">May 2024</div>
                <div class="timeline-item">Jun 2024</div>
            `;
        }

        container.innerHTML = this.projects.map(project => `
            <div class="gantt-row">
                <div class="gantt-project">${project.name}</div>
                <div class="gantt-bar" style="width: ${project.progress}%; margin-left: ${this.calculateGanttOffset(project.startDate)}%"></div>
            </div>
        `).join('');
    }

    renderResources() {
        const container = document.getElementById('resource-tbody');
        if (!container) return;

        container.innerHTML = this.resources.map(resource => `
            <tr>
                <td>${resource.name}</td>
                <td>${resource.role}</td>
                <td>${resource.currentProject}</td>
                <td>
                    <div class="utilization-bar">
                        <div class="utilization-fill" style="width: ${resource.utilization}%"></div>
                    </div>
                    ${resource.utilization}%
                </td>
                <td>${resource.availability}</td>
                <td>$${resource.costPerHour}/hr</td>
                <td>
                    <button class="btn btn-link" onclick="editResource(${resource.id})">Edit</button>
                </td>
            </tr>
        `).join('');

        this.renderTeamCapacity();
    }

    renderTeamCapacity() {
        const container = document.getElementById('team-capacity');
        if (!container) return;

        container.innerHTML = this.resources.map(resource => `
            <div class="capacity-item">
                <div class="capacity-info">
                    <div class="capacity-name">${resource.name}</div>
                    <div class="capacity-role">${resource.role}</div>
                </div>
                <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${resource.utilization}%"></div>
                </div>
            </div>
        `).join('');
    }

    renderCalendar() {
        const container = document.getElementById('calendar-grid');
        if (!container) return;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let calendarHTML = '';
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = currentDate.getMonth() === currentMonth;
            const dayEvents = this.getEventsForDate(currentDate);
            
            calendarHTML += `
                <div class="calendar-day ${!isCurrentMonth ? 'other-month' : ''}">
                    <div class="day-number">${currentDate.getDate()}</div>
                    <div class="day-events">
                        ${dayEvents.map(event => `<div class="event-item">${event}</div>`).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = calendarHTML;
        document.getElementById('calendar-title').textContent = `${this.getMonthName(currentMonth)} ${currentYear}`;
    }

    renderReports() {
        this.renderCompletionChart();
    }

    renderCompletionChart() {
        const canvas = document.getElementById('completion-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = [65, 45, 80, 75, 85, 90];
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        
        this.drawChart(ctx, data, labels, canvas.width, canvas.height);
    }

    drawChart(ctx, data, labels, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        const maxValue = Math.max(...data);
        const barWidth = chartWidth / data.length;
        
        ctx.fillStyle = '#8e44ad';
        
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * barWidth + barWidth * 0.1;
            const y = height - padding - barHeight;
            
            ctx.fillRect(x, y, barWidth * 0.8, barHeight);
            
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x + barWidth * 0.4, height - padding + 20);
            ctx.fillText(value + '%', x + barWidth * 0.4, y - 5);
            
            ctx.fillStyle = '#8e44ad';
        });
    }

    filterProjects() {
        const statusFilter = document.getElementById('status-filter')?.value || '';
        const priorityFilter = document.getElementById('priority-filter')?.value || '';
        const managerFilter = document.getElementById('manager-filter')?.value || '';
        const searchQuery = document.getElementById('project-search')?.value.toLowerCase() || '';

        const filteredProjects = this.projects.filter(project => {
            return (
                (statusFilter === '' || project.status === statusFilter) &&
                (priorityFilter === '' || project.priority === priorityFilter) &&
                (managerFilter === '' || project.manager === managerFilter) &&
                (searchQuery === '' || 
                 project.name.toLowerCase().includes(searchQuery) ||
                 project.description.toLowerCase().includes(searchQuery) ||
                 project.code.toLowerCase().includes(searchQuery))
            );
        });

        this.renderFilteredProjects(filteredProjects);
    }

    renderFilteredProjects(projects) {
        const container = document.getElementById('project-grid');
        if (!container) return;

        container.innerHTML = projects.map(project => `
            <div class="project-card" onclick="editProject(${project.id})">
                <div class="project-card-header">
                    <div>
                        <div class="project-title">${project.name}</div>
                        <div class="project-code">${project.code}</div>
                    </div>
                    <div class="priority-badge ${project.priority}">${this.formatPriority(project.priority)}</div>
                </div>
                <div class="project-description">${project.description}</div>
                <div class="project-progress">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>
                <div class="project-meta">
                    <span>Manager: ${this.getManagerName(project.manager)}</span>
                    <span class="project-status ${project.status}">${this.formatStatus(project.status)}</span>
                </div>
            </div>
        `).join('');
    }

    createProject() {
        const form = document.getElementById('project-form');
        const formData = new FormData(form);
        
        const newProject = {
            id: this.projects.length + 1,
            name: formData.get('name'),
            code: formData.get('code'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            manager: formData.get('manager'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            budget: parseInt(formData.get('budget')),
            client: formData.get('client'),
            status: 'planning',
            progress: 0
        };

        this.projects.push(newProject);
        this.renderProjects();
        this.closeModal('project-modal');
        form.reset();
    }

    createTask() {
        const form = document.getElementById('task-form');
        const formData = new FormData(form);
        
        const newTask = {
            id: this.tasks.length + 1,
            title: formData.get('title'),
            description: formData.get('description'),
            projectId: parseInt(formData.get('projectId')),
            assignee: formData.get('assignee'),
            priority: formData.get('priority'),
            dueDate: formData.get('dueDate'),
            estimatedHours: parseInt(formData.get('estimatedHours')),
            status: 'todo'
        };

        this.tasks.push(newTask);
        this.renderTasks();
        this.closeModal('task-modal');
        form.reset();
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    formatStatus(status) {
        const statusMap = {
            'planning': 'Planning',
            'active': 'Active',
            'on-hold': 'On Hold',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }

    formatPriority(priority) {
        const priorityMap = {
            'low': 'Low',
            'medium': 'Medium',
            'high': 'High',
            'critical': 'Critical'
        };
        return priorityMap[priority] || priority;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    getManagerName(managerId) {
        const managers = {
            'sarah-wilson': 'Sarah Wilson',
            'mike-chen': 'Mike Chen',
            'emily-davis': 'Emily Davis'
        };
        return managers[managerId] || managerId;
    }

    getAssigneeName(assigneeId) {
        const assignees = {
            'john-smith': 'JS',
            'sarah-wilson': 'SW',
            'mike-chen': 'MC',
            'emily-davis': 'ED'
        };
        return assignees[assigneeId] || assigneeId;
    }

    calculateGanttOffset(startDate) {
        const start = new Date(startDate);
        const yearStart = new Date(start.getFullYear(), 0, 1);
        const daysDiff = Math.floor((start - yearStart) / (1000 * 60 * 60 * 24));
        return (daysDiff / 365) * 100;
    }

    getEventsForDate(date) {
        const events = [];
        this.projects.forEach(project => {
            const startDate = new Date(project.startDate);
            const endDate = new Date(project.endDate);
            
            if (date >= startDate && date <= endDate) {
                events.push(project.name);
            }
        });
        return events.slice(0, 2);
    }

    getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }
}

// Global functions for modal and UI interactions
function createProject() {
    document.getElementById('project-modal').style.display = 'block';
}

function createTask(status = 'todo') {
    document.getElementById('task-modal').style.display = 'block';
    if (status !== 'todo') {
        document.getElementById('task-status').value = status;
    }
}

function editProject(projectId) {
    console.log('Edit project:', projectId);
}

function editTask(taskId) {
    console.log('Edit task:', taskId);
}

function editResource(resourceId) {
    console.log('Edit resource:', resourceId);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function importProjects() {
    console.log('Import projects');
}

function exportProjects() {
    console.log('Export projects');
}

function bulkActions() {
    console.log('Bulk actions');
}

function toggleView(view) {
    console.log('Toggle view:', view);
}

function exportGantt() {
    console.log('Export Gantt');
}

function addResource() {
    console.log('Add resource');
}

function resourceReports() {
    console.log('Resource reports');
}

function calendarView(view) {
    console.log('Calendar view:', view);
}

function navigateCalendar(direction) {
    console.log('Navigate calendar:', direction);
}

function addEvent() {
    console.log('Add event');
}

function generateReport() {
    console.log('Generate report');
}

function scheduleReport() {
    console.log('Schedule report');
}

function selectReport(reportType) {
    console.log('Select report:', reportType);
}

function refreshDashboard() {
    window.location.reload();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    new ProjectManagement();
});