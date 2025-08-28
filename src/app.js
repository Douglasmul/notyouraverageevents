// Load events from data/events.json and display in #calendar
fetch('data/events.json')
    .then(response => response.json())
    .then(events => {
        const calendar = document.getElementById('calendar');
        if (events.length === 0) {
            calendar.innerHTML = "<p>No events listed yet.</p>";
            return;
        }
        events.forEach(event => {
            const div = document.createElement('div');
            div.className = 'event';
            div.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-date">${event.date}</div>
                <div class="event-desc">${event.description}</div>
            `;
            calendar.appendChild(div);
        });
    })
    .catch(err => {
        document.getElementById('calendar').innerHTML = "<p>Could not load events.</p>";
    });