# Not Your Average Events

This project is a modern, interactive calendar web application for managing and discovering events. Built with HTML, CSS, and JavaScript, it features a sleek dark theme with responsive design.

## ✨ Features

- **📅 Event Calendar**: View all events in an organized, responsive grid layout
- **🔍 Search & Filter**: Search events by title/date and filter by category
- **➕ Event Creation**: Add new events with a user-friendly form
- **💾 Local Storage**: New events are saved in browser localStorage
- **🏷️ Categories**: Events are organized with color-coded categories (Meetup, Workshop, Conference)
- **📱 Responsive Design**: Optimized for both desktop and mobile devices
- **🔍 Event Details**: Click any event to view detailed information in a modal
- **🎨 Modern UI**: Beautiful gradient design with glassmorphism effects

## 🚀 Getting Started

1. Clone the repository to your local folder:
   ```bash
   git clone https://github.com/Douglasmul/notyouraverageevents.git
   ```
2. Open `index.html` in your browser to view the calendar
3. Or serve locally with:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## 📁 File Structure

- `index.html` - Main page with enhanced UI structure
- `src/styles.css` - Modern responsive styles with dark theme
- `src/app.js` - Enhanced JavaScript with all interactive features
- `data/events.json` - Sample events with categories and additional fields
- `assets/` - Folder for future images and resources

## 🎯 How to Use

### Adding Events
1. Click the "Add New Event" button
2. Fill in the event details (title, date, time, location, category, description)
3. Click "Add Event" to save (stored in browser localStorage)

### Searching & Filtering
- Use the search bar to find events by title or date
- Use the category dropdown to filter by event type
- Combine search and category filters for precise results

### Viewing Event Details
- Click on any event card to view detailed information in a modal popup
- Close the modal by clicking the × button or clicking outside the modal

## 🏗️ Technical Details

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage**: JSON file + browser localStorage for user-created events
- **Design**: Mobile-first responsive design with CSS Grid and Flexbox
- **Accessibility**: Semantic HTML and keyboard navigation support