let allData = [];
let chart = null;

Papa.parse('musicrevenue.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        console.log("running");
        console.log(results.data);
        allData = results.data;
        document.getElementById('typeFilter')
            .addEventListener('change', updatePage);
        document.getElementById('sortOrder')
            .addEventListener('change', updatePage);
        updatePage();
    },

    error: function(err) {
        console.error("FAILED");
        console.error(err);
    }
});

function drawChart(rows) {
    if (chart) chart.destroy();
    chart = new Chart(document.getElementById('revenueChart'), {
        type: 'bar',
        data: {
            labels: rows.map(row => row.Platform),
            datasets: [{
                label: 'Illustrative streams for monthly minimum wage',
                data: rows.map(row =>
                    Number(row.StreamsForUSMonthlyMinimumWage)
                ),
                backgroundColor: '#176579'
            }]
        },
        options: {
            animation: false,
            scales: { y: { beginAtZero: true } }
        }
    });
}

function drawTable(rows) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.replaceChildren();

    rows.forEach(row => {

        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${row.Platform}</td>
            <td>${row.PayoutPerStreamUSD}</td>
            <td>${row.MonthlyUsersMillions}</td>
            <td>${row.Type}</td>
            <td>${row.StreamsForUSMonthlyMinimumWage}</td>
        `;

        tbody.appendChild(tr);
        
    });
}

function updatePage() {
    const type = document.getElementById('typeFilter').value;
    const rows = allData.filter(row =>
        type === 'All' || row.Type === type
    );
    const order = document.getElementById('sortOrder').value;
    if (order !== 'original') {
        rows.sort((a, b) => {
            const first = Number(a.StreamsForUSMonthlyMinimumWage);
            const second = Number(b.StreamsForUSMonthlyMinimumWage);
            return order === 'ascending' ? first - second : second - first;
        });
    }
    document.getElementById('rowCount').textContent =
        rows.length + ' platforms';
    drawTable(rows);
    drawChart(rows);
}
