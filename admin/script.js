document.addEventListener('DOMContentLoaded', async () => {
    const db = firebase.firestore();

    // Elements
    const elVisitors = document.getElementById('total-visitors');
    const elBasicOffers = document.getElementById('basic-offer-clicks');
    const elPremiumOffers = document.getElementById('premium-offer-clicks');
    const elUpgradeOffers = document.getElementById('upgrade-offer-clicks');
    const elRedirects = document.getElementById('total-redirects');
    const elRedirectPremium = document.getElementById('redirect-premium-clicks');
    const elRedirectBasic = document.getElementById('redirect-basic-clicks');
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
        let basicOfferClicks = 0;
        let premiumOfferClicks = 0;
        let upgradeOfferClicks = 0;
        let redirectVisitors = new Set();
        let redirectPremiumClicks = 0;
        let redirectBasicClicks = 0;
        let scrollDepth = { 25: 0, 50: 0, 75: 0, 100: 0 };

        events.forEach(ev => {
            if (ev.event_name === 'page_view') {
                homeVisitors.add(ev.session_id);
            }
            if (ev.event_name === 'click_basic_offer') {
                basicOfferClicks++;
            }
            if (ev.event_name === 'click_premium_offer') {
                premiumOfferClicks++;
            }
            if (ev.event_name === 'click_upgrade_offer') {
                upgradeOfferClicks++;
            }
            if (ev.event_name === 'page_view_redirect') {
                redirectVisitors.add(ev.session_id);
            }
            if (ev.event_name === 'click_redirect_premium') {
                redirectPremiumClicks++;
            }
            if (ev.event_name === 'click_redirect_basic') {
                redirectBasicClicks++;
            }
            if (ev.event_name === 'scroll_depth' && ev.depth) {
                scrollDepth[ev.depth]++;
            }
        });

        // Update UI
        const totalVisitors = homeVisitors.size;
        const totalRedirects = redirectVisitors.size;
        const totalOfferClicks = basicOfferClicks + premiumOfferClicks + upgradeOfferClicks + redirectPremiumClicks + redirectBasicClicks;

        // Conversion Rate (Unique Visitors -> Total Offer Clicks)
        const conversionRate = totalVisitors > 0 ? ((totalOfferClicks / totalVisitors) * 100).toFixed(1) : 0;

        elVisitors.innerText = totalVisitors;
        elBasicOffers.innerText = basicOfferClicks;
        elPremiumOffers.innerText = premiumOfferClicks;
        elUpgradeOffers.innerText = upgradeOfferClicks;
        elRedirects.innerText = totalRedirects;
        elRedirectPremium.innerText = redirectPremiumClicks;
        elRedirectBasic.innerText = redirectBasicClicks;
        elConversion.innerText = conversionRate + '%';

        // Update Scroll Depth Metrics
        [25, 50, 75, 100].forEach(milestone => {
            const count = scrollDepth[milestone];
            const percentage = totalVisitors > 0 ? ((count / totalVisitors) * 100).toFixed(0) : 0;
            document.getElementById(`scroll-${milestone}`).innerText = count;
            document.getElementById(`scroll-bar-${milestone}`).style.width = percentage + '%';
        });

        // Render Chart
        renderFunnelChart(totalVisitors, basicOfferClicks, premiumOfferClicks, upgradeOfferClicks, totalRedirects, redirectPremiumClicks, redirectBasicClicks);

        // Render Table
        renderTable(events.slice(0, 20)); // Show last 20 events

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        alert("Erro ao carregar dados. Verifique o console.");
    }
});

function renderFunnelChart(visitors, basicOffers, premiumOffers, upgradeOffers, redirects, redirectPremium, redirectBasic) {
    const ctx = document.getElementById('funnelChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Visitantes', 'Oferta Básica', 'Oferta Premium', 'Oferta Upgrade', 'Pág. Redirect', 'Redir. Premium', 'Redir. Básica'],
            datasets: [{
                label: 'Volume de Tráfego',
                data: [visitors, basicOffers, premiumOffers, upgradeOffers, redirects, redirectPremium, redirectBasic],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.6)',
                    'rgba(34, 197, 94, 0.6)',
                    'rgba(234, 179, 8, 0.6)',
                    'rgba(168, 85, 247, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(14, 165, 233, 0.6)',
                    'rgba(236, 72, 153, 0.6)'
                ],
                borderColor: [
                    'rgba(79, 70, 229, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(14, 165, 233, 1)',
                    'rgba(236, 72, 153, 1)'
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

// Clear Metrics Functionality
document.getElementById('clear-metrics-btn').addEventListener('click', async () => {
    if (!confirm('⚠️ ATENÇÃO: Isso vai deletar TODAS as métricas do Firestore!\n\nTem certeza que deseja continuar?')) {
        return;
    }

    if (!confirm('Última confirmação: Deletar TODOS os eventos?')) {
        return;
    }

    const btn = document.getElementById('clear-metrics-btn');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'Deletando...';

    try {
        const db = firebase.firestore();
        const batch = db.batch();
        let deleteCount = 0;

        // Get all events in batches and delete them
        const snapshot = await db.collection('events').limit(500).get();

        snapshot.forEach(doc => {
            batch.delete(doc.ref);
            deleteCount++;
        });

        await batch.commit();

        console.log(`Deleted ${deleteCount} events`);
        alert(`✅ ${deleteCount} eventos deletados com sucesso!\n\nRecarregando dashboard...`);

        // Reload the page
        location.reload();
    } catch (error) {
        console.error('Error clearing metrics:', error);
        alert('❌ Erro ao deletar métricas: ' + error.message);
        btn.disabled = false;
        btn.innerText = originalText;
    }
});
