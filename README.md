# Not Your Average Events

This project is a static website and calendar for events.

It uses HTML, CSS, and JavaScript, with events stored in a JSON file.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Douglasmul/notyouraverageevents.git
   cd notyouraverageevents
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   This will start a local development server at `http://localhost:3000`

### Alternative serving methods

- Use `npm run serve` for an alternative http-server
- Use `npm run dev` (same as npm start)
- Open `index.html` directly in your browser (but some features may not work due to CORS restrictions)

### For Termux Environment

This project is compatible with Termux. After installing Node.js and npm in Termux:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Access the site at `http://localhost:3000`

## Available Scripts

- `npm start` / `npm run dev` - Start development server with live-reload
- `npm run serve` - Start basic HTTP server
- `npm run build` - Display build info (no build step needed for static site)
- `npm test` - Display test info (no tests configured)

## File Structure

- `index.html` - Main page
- `src/styles.css` - Styles for the calendar and site
- `src/app.js` - JavaScript to load and display events
- `data/events.json` - List of events
- `data/venues.json` - List of venues
- `assets/` - Folder for future images and resources
- `package.json` - Node.js project configuration
- `node_modules/` - Dependencies (auto-generated, not committed to git)

## Features

- View events in a calendar format
- Filter events by category and cannabis-friendly status
- Add new events through a form interface
- Browse and filter venues
- Responsive design for mobile and desktop