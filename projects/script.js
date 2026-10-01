// Projects app
class ProjectManagement {
    constructor() {
        this.projects = [];
        this.tasks = [];
        this.resources = [];
        this.currentTab = 'dashboard';
        this.calendarOffset = 0;
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
                name: 'Corporate website redesign',
                code: 'WR-2026-001',
                description: 'Rebuild the corporate website with a new navigation and a faster page layout',
                status: 'active',
                priority: 'high',
                manager: 'sarah-wilson',
                startDate: '2026-04-06',
                endDate: '2026-11-27',
                budget: 50000,
                client: 'Internal',
                progress: 65
            },
            {
                id: 2,
                name: 'Customer mobile app',
                code: 'MAD-2026-002',
                description: 'Native iOS and Android app for the customer ordering portal',
                status: 'planning',
                priority: 'critical',
                manager: 'mike-chen',
                startDate: '2026-10-05',
                endDate: '2026-12-18',
                budget: 120000,
                client: 'Brightwater Logistics',
                progress: 15
            },
            {
                id: 3,
                name: 'Legacy data migration',
                code: 'DM-2026-003',
                description: 'Move the legacy order and inventory systems to cloud infrastructure',
                status: 'active',
                priority: 'medium',
                manager: 'emily-davis',
                startDate: '2026-02-02',
                endDate: '2026-10-16',
                budget: 75000,
                client: 'Kestrel Foods',
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
                dueDate: '2026-09-11',
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
                dueDate: '2026-10-05',
                estimatedHours: 60
            },
            {
                id: 3,
                title: 'API integration',
                description: 'Connect frontend with backend APIs',
                projectId: 2,
                status: 'todo',
                assignee: 'mike-chen',
                priority: 'medium',
                dueDate: '2026-10-14',
                estimatedHours: 40
            }
        ];

        this.resources = [
            {
                id: 1,
                name: 'Kwame Mensah',
                role: 'Frontend developer',
                currentProject: 'Corporate website redesign',
                utilization: 85,
                availability: 'Available',
                costPerHour: 75
            },
            {
                id: 2,
                name: 'Daniel Moreau',
                role: 'Project manager',
                currentProject: 'Corporate website redesign',
                utilization: 90,
                availability: 'Busy',
                costPerHour: 95
            },
            {
                id: 3,
                name: 'Sofia Marchetti',
                role: 'Full stack developer',
                currentProject: 'Customer mobile app',
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
        
        const activeItem = document.querySelector(`[data-tab="${tabName}"]`);
        activeItem.classList.add('active');
        const label = activeItem.querySelector('span').textContent.trim();
        document.title = `${label} | Projects | Westbrook Industries`;
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
        this.renderWorkloadChart();
    }

    renderProjectOverview() {
        const container = document.getElementById('project-overview');
        if (!container) return;

        container.innerHTML = this.projects.slice(0, 5).map(project => `
            <div class="project-item">
                <div class="project-info">
                    <div class="project-name">${project.name}</div>
                    <div class="project-details">${project.code}, ${project.client}</div>
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

        if (upcomingTasks.length === 0) {
            container.innerHTML = '<div class="empty-state">No deadlines in the next 7 days</div>';
            return;
        }

        container.innerHTML = upcomingTasks.map(task => `
            <div class="deadline-item">
                <div class="deadline-info">
                    <div class="deadline-task">${task.title}</div>
                    <div class="deadline-date">Due ${this.formatDate(task.dueDate)}</div>
                </div>
                <div class="priority-badge ${task.priority}">${this.formatPriority(task.priority)}</div>
            </div>
        `).join('');
    }

    renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        const activities = [
            { title: 'Project "Corporate website redesign" updated', time: '2 hours ago' },
            { title: 'Task "API integration" assigned to Sofia Marchetti', time: '4 hours ago' },
            { title: 'New project "Customer mobile app" created', time: '1 day ago' },
            { title: 'Resource "Kwame Mensah" availability changed', time: '2 days ago' }
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

        this.renderTaskColumn('todo-tasks', todoTasks, 'todo-count');
        this.renderTaskColumn('inprogress-tasks', inProgressTasks, 'inprogress-count');
        this.renderTaskColumn('review-tasks', reviewTasks, 'review-count');
        this.renderTaskColumn('done-tasks', doneTasks, 'done-count');
    }

    renderTaskColumn(containerId, tasks, countId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const count = countId && document.getElementById(countId);
        if (count) count.textContent = tasks.length;

        container.innerHTML = tasks.map(task => `
            <div class="task-card" onclick="editTask(${task.id})">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span class="priority-badge ${task.priority}">${this.formatPriority(task.priority)}</span>
                    <span>Due ${this.formatDate(task.dueDate)}</span>
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
                <div class="timeline-item">Jan</div>
                <div class="timeline-item">Feb</div>
                <div class="timeline-item">Mar</div>
                <div class="timeline-item">Apr</div>
                <div class="timeline-item">May</div>
                <div class="timeline-item">Jun</div>
                <div class="timeline-item">Jul</div>
                <div class="timeline-item">Aug</div>
                <div class="timeline-item">Sep</div>
                <div class="timeline-item">Oct</div>
                <div class="timeline-item">Nov</div>
                <div class="timeline-item">Dec</div>
            `;
        }

        container.innerHTML = this.projects.map(project => `
            <div class="gantt-row">
                <div class="gantt-project">${project.name}</div>
                <div class="gantt-bar ${project.status}" style="width: ${project.progress}%; margin-left: ${this.calculateGanttOffset(project.startDate)}%"></div>
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
                <td class="num">
                    <div class="utilization">
                        <div class="utilization-bar">
                            <div class="utilization-fill" style="width: ${resource.utilization}%"></div>
                        </div>
                        <span>${resource.utilization}%</span>
                    </div>
                </td>
                <td><span class="badge ${resource.availability === 'Available' ? 'tone-success' : 'tone-warning'}">${resource.availability}</span></td>
                <td class="num">$${resource.costPerHour.toFixed(2)}/hr</td>
                <td>
                    <button class="btn btn-link" onclick="editResource(${resource.id})">Edit</button>
                </td>
            </tr>
        `).join('');

        this.renderTeamCapacity();
        this.renderAllocationChart();
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
        const shown = new Date(today.getFullYear(), today.getMonth() + this.calendarOffset, 1);
        const currentMonth = shown.getMonth();
        const currentYear = shown.getFullYear();
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
                <div class="calendar-day ${!isCurrentMonth ? 'other-month' : ''}${currentDate.toDateString() === today.toDateString() ? ' today' : ''}">
                    <div class="day-number">${currentDate.getDate()}</div>
                    <div class="day-events">
                        ${dayEvents.map(event => `<div class="event-item">${event}</div>`).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = calendarHTML;
        document.getElementById('calendar-title').textContent = `${this.getMonthName(currentMonth)} ${currentYear}`;
        this.renderUpcomingEvents();
    }

    renderUpcomingEvents() {
        const container = document.getElementById('upcoming-events');
        if (!container) return;

        const now = new Date();
        const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const events = [];
        this.projects.forEach(project => {
            if (project.startDate >= todayIso) events.push({ date: project.startDate, text: `${project.name} starts` });
            if (project.endDate >= todayIso) events.push({ date: project.endDate, text: `${project.name} ends` });
        });
        events.sort((a, b) => a.date.localeCompare(b.date));

        if (events.length === 0) {
            container.innerHTML = '<div class="empty-state">No upcoming events</div>';
            return;
        }

        container.innerHTML = events.slice(0, 6).map(event => `
            <div class="event-row">
                <span class="event-date">${this.formatDate(event.date)}</span>
                <span>${event.text}</span>
            </div>
        `).join('');
    }

    renderReports() {
        this.renderCompletionChart();
    }

    renderCompletionChart() {
        const chart = this.prepareCanvas(document.getElementById('completion-chart'));
        if (!chart) return;

        const data = [65, 45, 80, 75, 85, 90];
        const labels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

        this.drawChart(chart.ctx, data, labels, chart.width, chart.height);
    }

    renderWorkloadChart() {
        const chart = this.prepareCanvas(document.getElementById('workload-chart'));
        if (!chart) return;

        const names = this.resources.map(resource => resource.name.split(' ')[0]);
        const data = this.resources.map(resource => resource.utilization);
        this.drawChart(chart.ctx, data, names, chart.width, chart.height);
    }

    renderAllocationChart() {
        const chart = this.prepareCanvas(document.getElementById('allocation-chart'));
        if (!chart) return;

        const byProject = {};
        this.resources.forEach(resource => {
            (byProject[resource.currentProject] = byProject[resource.currentProject] || []).push(resource.utilization);
        });
        const labels = Object.keys(byProject);
        const data = labels.map(name => Math.round(byProject[name].reduce((sum, v) => sum + v, 0) / byProject[name].length));
        this.drawChart(chart.ctx, data, labels, chart.width, chart.height);
    }

    cssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    prepareCanvas(canvas) {
        if (!canvas) return null;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return null;

        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        return { ctx, width, height };
    }

    drawChart(ctx, data, labels, width, height) {
        ctx.clearRect(0, 0, width, height);

        const font = this.cssVar('--font-sans');
        const padLeft = 36;
        const padRight = 12;
        const padTop = 22;
        const padBottom = 28;
        const chartWidth = width - padLeft - padRight;
        const chartHeight = height - padTop - padBottom;
        const top = 100;
        const barSlot = chartWidth / data.length;
        const barWidth = Math.min(barSlot * 0.6, 56);

        ctx.font = `11px ${font}`;
        ctx.lineWidth = 1;
        for (let step = 0; step <= 4; step++) {
            const value = (top / 4) * step;
            const y = Math.round(padTop + chartHeight - (value / top) * chartHeight) + 0.5;
            ctx.strokeStyle = this.cssVar('--chart-grid');
            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(width - padRight, y);
            ctx.stroke();
            ctx.fillStyle = this.cssVar('--text-muted');
            ctx.textAlign = 'right';
            ctx.fillText(value + '%', padLeft - 6, y + 4);
        }

        data.forEach((value, index) => {
            const barHeight = (value / top) * chartHeight;
            const x = padLeft + index * barSlot + (barSlot - barWidth) / 2;
            const y = padTop + chartHeight - barHeight;

            ctx.fillStyle = this.cssVar('--chart-1');
            ctx.fillRect(x, y, barWidth, barHeight);

            ctx.textAlign = 'center';
            ctx.fillStyle = this.cssVar('--text');
            ctx.fillText(value + '%', x + barWidth / 2, y - 6);
            ctx.fillStyle = this.cssVar('--text-muted');
            ctx.fillText(labels[index], x + barWidth / 2, height - padBottom + 16, barSlot - 4);
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
            id: this.tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1,
            title: formData.get('title'),
            description: formData.get('description'),
            projectId: parseInt(formData.get('projectId')) || null,
            assignee: formData.get('assignee'),
            priority: formData.get('priority'),
            dueDate: formData.get('dueDate'),
            estimatedHours: parseInt(formData.get('estimatedHours')) || null,
            status: formData.get('status') || 'todo'
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
            'on-hold': 'On hold',
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
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    }

    getManagerName(managerId) {
        const managers = {
            'sarah-wilson': 'Daniel Moreau',
            'mike-chen': 'Sofia Marchetti',
            'emily-davis': 'Rajesh Iyer'
        };
        return managers[managerId] || managerId;
    }

    getAssigneeName(assigneeId) {
        const assignees = {
            'john-smith': 'KM',
            'sarah-wilson': 'DM',
            'mike-chen': 'SM',
            'emily-davis': 'RI'
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
        const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const events = [];
        this.projects.forEach(project => {
            if (project.startDate === iso) events.push(`${project.name} starts`);
            if (project.endDate === iso) events.push(`${project.name} ends`);
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
    const statusSelect = document.getElementById('task-status');
    if (statusSelect) statusSelect.value = status;
    document.getElementById('task-modal').style.display = 'block';
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
    if (!window.projectApp) return;
    window.projectApp.calendarOffset += direction;
    window.projectApp.renderCalendar();
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
    window.projectApp = new ProjectManagement();
});