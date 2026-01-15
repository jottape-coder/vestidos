document.addEventListener('DOMContentLoaded', async () => {
    const db = firebase.firestore();

    // Elements
    const elVisitors = document.getElementById('total-visitors');
    const elLeads = document.getElementById('total-leads');
    const elRedirects = document.getElementById('total-redirects');
    const elConversion = document.getElementById('conversion-rate');
    const tableBody = document.getElementById('events-table-body');

    try {
        console.log("Fetching events from Firestore...");

        // Fetch last 500 events (limit to avoid excessive reads in proto)
        const snapshot = await db.collection('events')
            .orderBy('timestamp', 'desc')
            .limit(500)
            .get();

        const events = [];
        snapshot.forEach(doc => {
            events.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Fetched ${events.length} events.`);

        // Process Metrics
        let homeVisitors = new Set();
        let ctaClicks = 0;
        let redirectVisitors = new Set();

        events.forEach(ev => {
            if (ev.event_name === 'page_view') {
                homeVisitors.add(ev.session_id);
            }
            if (ev.event_name === 'click_cta') {
                ctaClicks++;
            }
            if (ev.event_name === 'page_view_redirect') {
                redirectVisitors.add(ev.session_id);
            }
        });

        // Update UI
        const totalVisitors = homeVisitors.size;
        const totalRedirects = redirectVisitors.size;

        // Conversion Rate (Unique Visitors -> CTA Clicks ratio roughly)
        // Note: For strict conversion, we'd track unique users clicking. 
        // Here we just show raw clicks vs unique visitors for a rough "Lead Volume" check.
        const conversionRate = totalVisitors > 0 ? ((ctaClicks / totalVisitors) * 100).toFixed(1) : 0;

        elVisitors.innerText = totalVisitors;
        elLeads.innerText = ctaClicks;
        elRedirects.innerText = totalRedirects;
        elConversion.innerText = conversionRate + '%';

        // Render Chart
        renderFunnelChart(totalVisitors, ctaClicks, totalRedirects);

        // Render Table
        renderTable(events.slice(0, 20)); // Show last 20 events

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        alert("Erro ao carregar dados. Verifique o console.");
    }
});

function renderFunnelChart(visitors, leads, redirects) {
    const ctx = document.getElementById('funnelChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Visitantes (Home)', 'Leads (Cliques)', 'Pág. Upgrade'],
            datasets: [{
                label: 'Volume de Tráfego',
                data: [visitors, leads, redirects],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(245, 158, 11, 0.6)'
                ],
                borderColor: [
                    'rgba(79, 70, 229, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderTable(events) {
    const tbody = document.getElementById('events-table-body');
    tbody.innerHTML = '';

    if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nenhum evento registrado ainda.</td></tr>';
        return;
    }

    events.forEach(ev => {
        const date = ev.timestamp ? new Date(ev.timestamp.seconds * 1000).toLocaleString() : 'N/A';
        const details = JSON.stringify(ev).substring(0, 50) + '...'; // Simplified details

        let detailsText = '';
        if (ev.page) detailsText += `Page: ${ev.page} `;
        if (ev.button_text) detailsText += `Btn: ${ev.button_text}`;

        const row = `
            <tr>
                <td>${date}</td>
                <td><strong>${ev.event_name}</strong></td>
                <td>${ev.url ? new URL(ev.url).pathname : 'N/A'}</td>
                <td style="font-size: 0.75rem; color: #666;">${detailsText}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}
