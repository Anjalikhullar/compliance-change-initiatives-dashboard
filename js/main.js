// Initialize services
const airtableService = new AirtableService();
const chartManager = new ChartManager();

// State
let allRecords = [];
let filteredRecords = [];

// Initialize dashboard
async function initDashboard() {
    try {
        showLoading();
        
        // Fetch data from Airtable
        allRecords = await airtableService.fetchRecords();
        filteredRecords = [...allRecords];
        
        // Update all dashboard components
        updateKPIs();
        updateCharts();
        updateTimeline();
        updateTable();
        updateLastUpdated();
        
        hideLoading();
        
        console.log('✅ Dashboard initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing dashboard:', error);
        showError('Failed to load data. Please check your Airtable configuration.');
    }
}

// Update KPI cards
function updateKPIs() {
    const kpis = airtableService.getKPIs();
    
    document.getElementById('totalInitiatives').textContent = kpis.total;
    document.getElementById('activeInitiatives').textContent = kpis.active;
    document.getElementById('completedInitiatives').textContent = kpis.completed;
    document.getElementById('onHoldInitiatives').textContent = kpis.onHold;
    document.getElementById('avgProgress').textContent = kpis.avgProgress + '%';
}

// Update all charts
function updateCharts() {
    chartManager.createStatusChart(airtableService.getInitiativesByStatus());
    chartManager.createPriorityChart(airtableService.getInitiativesByPriority());
    chartManager.createEffortChart(airtableService.getInitiativesByEffort());
    chartManager.createCategoryChart(airtableService.getInitiativesByCategory());
}

// Update timeline
function updateTimeline() {
    const container = document.getElementById('timelineContainer');
    const records = airtableService.getRecords()
        .filter(r => r.fields['Start Date'] || r.fields['Target Completion Date'])
        .sort((a, b) => {
            const dateA = new Date(a.fields['Target Completion Date'] || a.fields['Start Date']);
            const dateB = new Date(b.fields['Target Completion Date'] || b.fields['Start Date']);
            return dateA - dateB;
        });

    if (records.length === 0) {
        container.innerHTML = '<p>No timeline data available</p>';
        return;
    }

    container.innerHTML = records.map(record => {
        const fields = record.fields;
        const startDate = fields['Start Date'] ? formatDate(fields['Start Date']) : 'Not set';
        const targetDate = fields['Target Completion Date'] ? formatDate(fields['Target Completion Date']) : 'Not set';
        
        return `
            <div class="timeline-item">
                <h3>${fields['Initiative Name'] || 'Unnamed Initiative'}</h3>
                <p><strong>Status:</strong> ${fields.Status || 'Unknown'} | 
                   <strong>Start:</strong> ${startDate} | 
                   <strong>Target:</strong> ${targetDate}</p>
            </div>
        `;
    }).join('');
}

// Update table
function updateTable() {
    const tbody = document.getElementById('tableBody');
    
    if (filteredRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9">No initiatives found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredRecords.map(record => {
        const fields = record.fields;
        return `
            <tr>
                <td><strong>${fields['Initiative Name'] || 'Unnamed'}</strong></td>
                <td><span class="status-badge status-${(fields.Status || '').toLowerCase().replace(' ', '-')}">${fields.Status || 'Unknown'}</span></td>
                <td><span class="priority-badge priority-${(fields.Priority || '').toLowerCase()}">${fields.Priority || 'N/A'}</span></td>
                <td>${fields.Category || 'N/A'}</td>
                <td>${fields.DRI || 'N/A'}</td>
                <td>${fields['PM Effort Size'] || 'N/A'}</td>
                <td>${fields['Start Date'] ? formatDate(fields['Start Date']) : 'N/A'}</td>
                <td>${fields['Target Completion Date'] ? formatDate(fields['Target Completion Date']) : 'N/A'}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${fields['Progress %'] || 0}%">
                            ${fields['Progress %'] || 0}%
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter functions
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;

    filteredRecords = allRecords.filter(record => {
        const fields = record.fields;
        
        // Search filter
        const matchesSearch = !searchTerm || 
            (fields['Initiative Name'] || '').toLowerCase().includes(searchTerm) ||
            (fields.DRI || '').toLowerCase().includes(searchTerm);
        
        // Status filter
        const matchesStatus = !statusFilter || fields.Status === statusFilter;
        
        // Priority filter
        const matchesPriority = !priorityFilter || fields.Priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesPriority;
    });

    updateTable();
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toLocaleString();
}

function showLoading() {
    console.log('Loading...');
}

function hideLoading() {
    console.log('Loading complete');
}

function showError(message) {
    alert(message);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard
    initDashboard();
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        initDashboard();
    });
    
    // Search and filter
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('priorityFilter').addEventListener('change', applyFilters);
    
    // Auto-refresh every 30 minutes
    setInterval(initDashboard, CONFIG.REFRESH_INTERVAL);
});
