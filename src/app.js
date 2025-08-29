// Global variables
let allEvents = [];
let filteredEvents = [];

// DOM elements
const calendar = document.getElementById('calendar');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const addEventBtn = document.getElementById('addEventBtn');
const eventForm = document.getElementById('eventForm');
const newEventForm = document.getElementById('newEventForm');
const cancelEventBtn = document.getElementById('cancelEventBtn');
const eventModal = document.getElementById('eventModal');
const closeModal = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    setupEventListeners();
});

// Load events from JSON and localStorage
async function loadEvents() {
    try {
        // Load events from JSON file
        const response = await fetch('data/events.json');
        const jsonEvents = await response.json();
        
        // Load events from localStorage
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
        
        // Combine all events
        allEvents = [...jsonEvents, ...localEvents];
        filteredEvents = [...allEvents];
        
        displayEvents();
    } catch (err) {
        calendar.innerHTML = "<p class='no-events'>Could not load events.</p>";
        console.error('Error loading events:', err);
    }
}

// Display events in the calendar
function displayEvents() {
    if (filteredEvents.length === 0) {
        calendar.innerHTML = "<p class='no-events'>No events found matching your criteria.</p>";
        return;
    }
    
    // Sort events by date
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    calendar.innerHTML = '';
    filteredEvents.forEach((event, index) => {
        const eventDiv = createEventElement(event, index);
        calendar.appendChild(eventDiv);
    });
}

// Create an event element
function createEventElement(event, index) {
    const div = document.createElement('div');
    div.className = 'event';
    div.onclick = () => showEventModal(event);
    
    const categoryClass = `category-${event.category.toLowerCase()}`;
    
    div.innerHTML = `
        <div class="event-title">${escapeHtml(event.title)}</div>
        <div class="event-date">${formatDate(event.date)}</div>
        ${event.time ? `<div class="event-time">🕒 ${escapeHtml(event.time)}</div>` : ''}
        ${event.location ? `<div class="event-location">📍 ${escapeHtml(event.location)}</div>` : ''}
        <div class="event-desc">${escapeHtml(event.description)}</div>
        <span class="event-category ${categoryClass}">${escapeHtml(event.category)}</span>
    `;
    
    return div;
}

// Show event details in modal
function showEventModal(event) {
    modalContent.innerHTML = `
        <h2>${escapeHtml(event.title)}</h2>
        <p><strong>Date:</strong> ${formatDate(event.date)}</p>
        ${event.time ? `<p><strong>Time:</strong> ${escapeHtml(event.time)}</p>` : ''}
        ${event.location ? `<p><strong>Location:</strong> ${escapeHtml(event.location)}</p>` : ''}
        <p><strong>Category:</strong> ${escapeHtml(event.category)}</p>
        <p><strong>Description:</strong></p>
        <p>${escapeHtml(event.description)}</p>
    `;
    eventModal.classList.remove('hidden');
}

// Setup event listeners
function setupEventListeners() {
    // Search and filter
    searchInput.addEventListener('input', filterEvents);
    categoryFilter.addEventListener('change', filterEvents);
    
    // Add event form
    addEventBtn.addEventListener('click', showEventForm);
    cancelEventBtn.addEventListener('click', hideEventForm);
    newEventForm.addEventListener('submit', handleAddEvent);
    
    // Modal
    closeModal.addEventListener('click', hideEventModal);
    eventModal.addEventListener('click', function(e) {
        if (e.target === eventModal) {
            hideEventModal();
        }
    });
    
    // Escape key to close modal/form
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideEventModal();
            hideEventForm();
        }
    });
}

// Filter events based on search and category
function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    
    filteredEvents = allEvents.filter(event => {
        const matchesSearch = !searchTerm || 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.date.includes(searchTerm);
            
        const matchesCategory = !selectedCategory || event.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    displayEvents();
}

// Show event creation form
function showEventForm() {
    eventForm.classList.remove('hidden');
    document.getElementById('eventTitle').focus();
}

// Hide event creation form
function hideEventForm() {
    eventForm.classList.add('hidden');
    newEventForm.reset();
}

// Handle adding new event
function handleAddEvent(e) {
    e.preventDefault();
    
    const newEvent = {
        title: document.getElementById('eventTitle').value.trim(),
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value.trim(),
        category: document.getElementById('eventCategory').value,
        description: document.getElementById('eventDescription').value.trim(),
        isLocal: true // Mark as locally created
    };
    
    // Validate required fields
    if (!newEvent.title || !newEvent.date || !newEvent.category || !newEvent.description) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Add to events array
    allEvents.push(newEvent);
    
    // Save to localStorage
    const localEvents = allEvents.filter(event => event.isLocal);
    localStorage.setItem('localEvents', JSON.stringify(localEvents));
    
    // Update display
    filterEvents();
    hideEventForm();
    
    // Show success message
    showNotification('Event added successfully!');
}

// Hide event modal
function hideEventModal() {
    eventModal.classList.add('hidden');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}