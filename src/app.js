// Global variables
let allEvents = [];
let allVenues = [];
let currentFilter = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupNavigation();
    setupEventForm();
});

// Load all data
async function loadData() {
    try {
        const [eventsResponse, venuesResponse] = await Promise.all([
            fetch('data/events.json'),
            fetch('data/venues.json')
        ]);
        
        allEvents = await eventsResponse.json();
        allVenues = await venuesResponse.json();
        
        displayEvents(allEvents);
        setupFilters();
        populateVenueSelect();
        displayVenues(allVenues);
        
        // Show latest event modal on app load
        showLatestEventModal();
    } catch (err) {
        document.getElementById('calendar').innerHTML = "<p>Could not load data.</p>";
    }
}

// Setup navigation
function setupNavigation() {
    const viewEventsBtn = document.getElementById('view-events-btn');
    const addEventBtn = document.getElementById('add-event-btn');
    const viewVenuesBtn = document.getElementById('view-venues-btn');
    
    viewEventsBtn.addEventListener('click', () => showView('events'));
    addEventBtn.addEventListener('click', () => showView('add-event'));
    viewVenuesBtn.addEventListener('click', () => showView('venues'));
}

// Show specific view
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Remove active state from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected view and activate corresponding button
    switch(viewName) {
        case 'events':
            document.getElementById('events-view').classList.add('active');
            document.getElementById('view-events-btn').classList.add('active');
            break;
        case 'add-event':
            document.getElementById('add-event-view').classList.add('active');
            document.getElementById('add-event-btn').classList.add('active');
            break;
        case 'venues':
            document.getElementById('venues-view').classList.add('active');
            document.getElementById('view-venues-btn').classList.add('active');
            setupVenueFilters();
            break;
    }
}

// Display events in the calendar
function displayEvents(events) {
    const calendar = document.getElementById('calendar');
    
    if (events.length === 0) {
        calendar.innerHTML = "<p>No events found for the selected filter.</p>";
        return;
    }
    
    // Clear existing events
    calendar.innerHTML = '';
    
    events.forEach(event => {
        const div = document.createElement('div');
        div.className = `event ${event.cannabisFriendly ? 'cannabis-friendly' : ''}`;
        
        // Create cannabis-friendly indicator
        const cannabisIndicator = event.cannabisFriendly ? 
            '<span class="cannabis-indicator">🌿 Cannabis Friendly</span>' : '';
        
        // Create venue info
        const venueInfo = event.venue ? 
            `<div class="event-venue">📍 ${event.venue.name}</div>` : '';
        
        // Create category badge
        const categoryBadge = event.category ? 
            `<span class="category-badge category-${event.category}">${event.category}</span>` : '';
        
        div.innerHTML = `
            <div class="event-header">
                <div class="event-title">${event.title}</div>
                ${categoryBadge}
                ${cannabisIndicator}
            </div>
            <div class="event-date">${event.date}</div>
            ${venueInfo}
            <div class="event-desc">${event.description}</div>
        `;
        
        // Add click listener for detailed view
        div.addEventListener('click', () => showEventDetails(event));
        
        calendar.appendChild(div);
    });
}

// Setup filter controls
function setupFilters() {
    const filterContainer = document.getElementById('filter-container');
    if (!filterContainer) return;
    
    filterContainer.innerHTML = `
        <div class="filter-group">
            <label for="event-filter">Filter Events:</label>
            <select id="event-filter">
                <option value="all">All Events</option>
                <option value="cannabis-friendly">Cannabis Friendly Only</option>
                <option value="regular">Regular Events Only</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="category-filter">Category:</label>
            <select id="category-filter">
                <option value="all">All Categories</option>
                <option value="community">Community</option>
                <option value="workshop">Workshop</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="wellness">Wellness</option>
            </select>
        </div>
    `;
    
    // Add event listeners for filters
    document.getElementById('event-filter').addEventListener('change', applyFilters);
    document.getElementById('category-filter').addEventListener('change', applyFilters);
}

// Apply selected filters
function applyFilters() {
    const eventFilter = document.getElementById('event-filter')?.value || 'all';
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    
    let filteredEvents = allEvents;
    
    // Apply cannabis-friendly filter
    if (eventFilter === 'cannabis-friendly') {
        filteredEvents = filteredEvents.filter(event => event.cannabisFriendly);
    } else if (eventFilter === 'regular') {
        filteredEvents = filteredEvents.filter(event => !event.cannabisFriendly);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.category === categoryFilter);
    }
    
    displayEvents(filteredEvents);
}

// Show detailed event information in a modal
function showEventDetails(event) {
    const modal = document.getElementById('event-modal') || createModal();
    
    const amenitiesHtml = event.venue?.amenities ? 
        `<div class="venue-amenities">
            <strong>Amenities:</strong> ${event.venue.amenities.join(', ')}
        </div>` : '';
    
    const cannabisInfo = event.cannabisFriendly ? 
        `<div class="cannabis-info">
            <span class="cannabis-indicator">🌿 Cannabis Friendly Event</span>
            <p>This event welcomes cannabis consumption in accordance with local laws.</p>
        </div>` : '';
    
    modal.querySelector('.modal-content').innerHTML = `
        <span class="close">&times;</span>
        <div class="featured-image-container">
            <img src="assets/event-flyer.svg" alt="Event Flyer" class="featured-image" onerror="this.style.display='none'">
        </div>
        <h2>${event.title}</h2>
        <div class="event-details">
            <div class="detail-row">
                <strong>Date:</strong> ${event.date}
            </div>
            <div class="detail-row">
                <strong>Category:</strong> 
                <span class="category-badge category-${event.category}">${event.category}</span>
            </div>
            ${event.venue ? `
                <div class="detail-row">
                    <strong>Venue:</strong> ${event.venue.name}
                </div>
                <div class="detail-row">
                    <strong>Address:</strong> ${event.venue.address}
                </div>
                ${amenitiesHtml}
            ` : ''}
            ${cannabisInfo}
            <div class="detail-row">
                <strong>Description:</strong>
                <p>${event.description}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Close modal functionality
    modal.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Create modal if it doesn't exist
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'event-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <!-- Content will be inserted here -->
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// Show latest event modal on app load
function showLatestEventModal() {
    if (!allEvents || allEvents.length === 0) {
        return; // No events to show
    }
    
    // Find the most recent event by sorting by date
    const sortedEvents = [...allEvents].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestEvent = sortedEvents[0];
    
    const modal = document.getElementById('event-modal') || createModal();
    
    const amenitiesHtml = latestEvent.venue?.amenities ? 
        `<div class="venue-amenities">
            <strong>Amenities:</strong> ${latestEvent.venue.amenities.join(', ')}
        </div>` : '';
    
    const cannabisInfo = latestEvent.cannabisFriendly ? 
        `<div class="cannabis-info">
            <span class="cannabis-indicator">🌿 Cannabis Friendly Event</span>
            <p>This event welcomes cannabis consumption in accordance with local laws.</p>
        </div>` : '';
    
    modal.querySelector('.modal-content').innerHTML = `
        <span class="close">&times;</span>
        <div class="featured-image-container">
            <img src="assets/event-flyer.svg" alt="Latest Event Flyer" class="featured-image" onerror="this.style.display='none'">
        </div>
        <h2>🎉 Latest Event</h2>
        <h3>${latestEvent.title}</h3>
        <div class="event-details">
            <div class="detail-row">
                <strong>Date:</strong> ${latestEvent.date}
            </div>
            <div class="detail-row">
                <strong>Category:</strong> 
                <span class="category-badge category-${latestEvent.category}">${latestEvent.category}</span>
            </div>
            ${latestEvent.venue ? `
                <div class="detail-row">
                    <strong>Venue:</strong> ${latestEvent.venue.name}
                </div>
                <div class="detail-row">
                    <strong>Address:</strong> ${latestEvent.venue.address}
                </div>
                ${amenitiesHtml}
            ` : ''}
            ${cannabisInfo}
            <div class="detail-row">
                <strong>Description:</strong>
                <p>${latestEvent.description}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    const outsideClickHandler = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            window.removeEventListener('click', outsideClickHandler);
        }
    };
    window.addEventListener('click', outsideClickHandler);
}

// Setup event form
function setupEventForm() {
    const form = document.getElementById('event-form');
    const cancelBtn = document.getElementById('cancel-event-btn');
    
    form.addEventListener('submit', handleEventSubmit);
    cancelBtn.addEventListener('click', () => {
        form.reset();
        showView('events');
    });
}

// Handle event form submission
function handleEventSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const selectedVenue = allVenues.find(v => v.id === document.getElementById('venue-select').value);
    
    const newEvent = {
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        category: document.getElementById('event-category').value,
        description: document.getElementById('event-description').value,
        venue: selectedVenue,
        cannabisFriendly: document.getElementById('cannabis-friendly-event').checked
    };
    
    // Add to events array (in a real app, this would go to a server)
    allEvents.push(newEvent);
    
    // Reset form and show events view
    e.target.reset();
    showView('events');
    displayEvents(allEvents);
    
    // Show success message
    alert('Event added successfully!');
}

// Populate venue select dropdown
function populateVenueSelect() {
    const select = document.getElementById('venue-select');
    select.innerHTML = '<option value="">Select Venue</option>';
    
    allVenues.forEach(venue => {
        const option = document.createElement('option');
        option.value = venue.id;
        option.textContent = `${venue.name} ${venue.cannabisFriendly ? '🌿' : ''}`;
        select.appendChild(option);
    });
}

// Display venues
function displayVenues(venues) {
    const venuesList = document.getElementById('venues-list');
    
    if (venues.length === 0) {
        venuesList.innerHTML = "<p>No venues found for the selected filter.</p>";
        return;
    }
    
    venuesList.innerHTML = '';
    
    venues.forEach(venue => {
        const div = document.createElement('div');
        div.className = `venue-card ${venue.cannabisFriendly ? 'cannabis-friendly' : ''}`;
        
        const cannabisIndicator = venue.cannabisFriendly ? 
            '<span class="cannabis-indicator">🌿 Cannabis Friendly</span>' : '';
        
        div.innerHTML = `
            <div class="venue-header">
                <h3>${venue.name}</h3>
                ${cannabisIndicator}
            </div>
            <div class="venue-info">
                <div class="venue-address">📍 ${venue.address}</div>
                <div class="venue-capacity">👥 Capacity: ${venue.capacity}</div>
                <div class="venue-amenities">
                    <strong>Amenities:</strong> ${venue.amenities.join(', ')}
                </div>
                <div class="venue-description">${venue.description}</div>
                <div class="venue-contact">
                    📞 ${venue.contact.phone} | ✉️ ${venue.contact.email}
                </div>
            </div>
        `;
        
        venuesList.appendChild(div);
    });
}

// Setup venue filters
function setupVenueFilters() {
    const filter = document.getElementById('venue-filter');
    filter.addEventListener('change', applyVenueFilters);
}

// Apply venue filters
function applyVenueFilters() {
    const filter = document.getElementById('venue-filter').value;
    let filteredVenues = allVenues;
    
    if (filter === 'cannabis-friendly') {
        filteredVenues = allVenues.filter(venue => venue.cannabisFriendly);
    } else if (filter === 'regular') {
        filteredVenues = allVenues.filter(venue => !venue.cannabisFriendly);
    }
    
    displayVenues(filteredVenues);
}