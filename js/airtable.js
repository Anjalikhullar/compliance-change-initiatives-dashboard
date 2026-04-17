class AirtableService {
    constructor() {
        this.baseUrl = `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.TABLE_ID}`;
        this.records = [];
    }

    async fetchRecords() {
        try {
            // Fetch from the generated data.json file instead of Airtable API
            const response = await fetch(CONFIG.DATA_FILE);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.records = data.records;
            
            console.log('✅ Fetched', this.records.length, 'records from data file');
            return this.records;

        } catch (error) {
            console.error('❌ Error fetching data:', error);
            throw error;
        }
    }

    getRecords() {
        return this.records;
    }

    getInitiativesByStatus() {
        const statusCount = {};
        this.records.forEach(record => {
            const status = record.fields.Status || 'Unknown';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });
        return statusCount;
    }

    getInitiativesByPriority() {
        const priorityCount = {};
        this.records.forEach(record => {
            const priority = record.fields.Priority || 'Unknown';
            priorityCount[priority] = (priorityCount[priority] || 0) + 1;
        });
        return priorityCount;
    }

    getInitiativesByEffort() {
        const effortCount = {};
        this.records.forEach(record => {
            const effort = record.fields['PM Effort Size'] || 'Unknown';
            effortCount[effort] = (effortCount[effort] || 0) + 1;
        });
        return effortCount;
    }

    getInitiativesByCategory() {
        const categoryCount = {};
        this.records.forEach(record => {
            const category = record.fields.Category || 'Unknown';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        return categoryCount;
    }

    getKPIs() {
        const total = this.records.length;
        const active = this.records.filter(r => 
            r.fields.Status === 'In Progress' || r.fields.Status === 'Planning'
        ).length;
        const completed = this.records.filter(r => 
            r.fields.Status === 'Completed'
        ).length;
        const onHold = this.records.filter(r => 
            r.fields.Status === 'On Hold'
        ).length;

        const progressValues = this.records
            .filter(r => r.fields['Progress %'] !== undefined)
            .map(r => r.fields['Progress %']);
        const avgProgress = progressValues.length > 0
            ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
            : 0;

        return {
            total,
            active,
            completed,
            onHold,
            avgProgress
        };
    }
}
