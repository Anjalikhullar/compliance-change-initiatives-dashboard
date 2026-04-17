class ChartManager {
    constructor() {
        this.charts = {};
    }

    createStatusChart(data) {
        const ctx = document.getElementById('statusChart');
        if (this.charts.status) this.charts.status.destroy();

        const labels = Object.keys(data);
        const values = Object.values(data);
        const colors = {
            'Planning': '#2196F3',
            'In Progress': '#4CAF50',
            'On Hold': '#FF9800',
            'Completed': '#9C27B0',
            'Cancelled': '#F44336'
        };

        this.charts.status = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Initiatives',
                    data: values,
                    backgroundColor: labels.map(label => colors[label] || '#757575')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    createPriorityChart(data) {
        const ctx = document.getElementById('priorityChart');
        if (this.charts.priority) this.charts.priority.destroy();

        const priorityOrder = ['P0', 'P1', 'P2', 'P3'];
        const labels = priorityOrder.filter(p => data[p]);
        const values = labels.map(p => data[p]);
        const colors = {
            'P0': '#C62828',
            'P1': '#F57C00',
            'P2': '#FBC02D',
            'P3': '#9E9E9E'
        };

        this.charts.priority = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: labels.map(label => colors[label])
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createEffortChart(data) {
        const ctx = document.getElementById('effortChart');
        if (this.charts.effort) this.charts.effort.destroy();

        const effortOrder = ['XS', 'S', 'M', 'L', 'XL'];
        const labels = effortOrder.filter(e => data[e]);
        const values = labels.map(e => data[e]);

        this.charts.effort = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Initiatives',
                    data: values,
                    backgroundColor: '#2a5298'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    createCategoryChart(data) {
        const ctx = document.getElementById('categoryChart');
        if (this.charts.category) this.charts.category.destroy();

        const labels = Object.keys(data);
        const values = Object.values(data);

        this.charts.category = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: ['#1e3c72', '#2a5298', '#3d6bb3', '#5184ce']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}
