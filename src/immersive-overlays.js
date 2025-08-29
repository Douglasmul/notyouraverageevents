// 🌿 Immersive Cannabis-Themed Overlay System
class ImmersiveOverlaySystem {
    constructor() {
        this.activePanel = null;
        this.notificationQueue = [];
        this.isShowingNotification = false;
        this.init();
    }

    init() {
        this.createParallaxElements();
        this.setupEventListeners();
        this.createNotificationBanner();
    }

    // Create floating cannabis leaf parallax elements
    createParallaxElements() {
        const leafEmojis = ['🌿', '🍃', '🌱', '🌿'];
        
        for (let i = 0; i < 4; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'parallax-cannabis-leaf';
            leaf.textContent = leafEmojis[i];
            leaf.style.left = Math.random() * 100 + '%';
            leaf.style.animationDuration = (15 + Math.random() * 10) + 's';
            leaf.style.animationDelay = Math.random() * 10 + 's';
            document.body.appendChild(leaf);
        }
    }

    // Create notification banner element
    createNotificationBanner() {
        const banner = document.createElement('div');
        banner.id = 'notification-banner';
        banner.className = 'notification-banner';
        document.body.appendChild(banner);
    }

    // Show animated notification banner
    showNotification(message, type = 'success', duration = 3000) {
        if (this.isShowingNotification) {
            this.notificationQueue.push({ message, type, duration });
            return;
        }

        this.isShowingNotification = true;
        const banner = document.getElementById('notification-banner');
        
        // Set banner content and style based on type
        banner.textContent = message;
        banner.className = `notification-banner show ${type}`;
        
        // Add sparkle effects
        this.createSparkleEffect(banner);
        
        setTimeout(() => {
            banner.classList.remove('show');
            this.isShowingNotification = false;
            
            // Process queue
            if (this.notificationQueue.length > 0) {
                const next = this.notificationQueue.shift();
                setTimeout(() => this.showNotification(next.message, next.type, next.duration), 300);
            }
        }, duration);
    }

    // Create sparkle effect around element
    createSparkleEffect(element) {
        const rect = element.getBoundingClientRect();
        const sparkleCount = 8;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'cannabis-sparkle-effect';
            sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
            sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
            sparkle.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1500);
        }
    }

    // Show event details in sliding panel
    showEventPanel(event) {
        // Close existing panel if open
        if (this.activePanel) {
            this.closePanel();
            setTimeout(() => this.createEventPanel(event), 300);
        } else {
            this.createEventPanel(event);
        }
    }

    createEventPanel(event) {
        const panel = document.createElement('div');
        panel.className = 'immersive-panel';
        panel.id = 'event-panel';
        
        panel.innerHTML = this.generateEventPanelHTML(event);
        document.body.appendChild(panel);
        
        // Trigger animation
        setTimeout(() => panel.classList.add('active'), 50);
        
        // Setup panel event listeners
        this.setupPanelEventListeners(panel, event);
        this.activePanel = panel;
        
        // Start countdown if event has date
        if (event.date) {
            this.startPanelCountdown(event.date);
        }
    }

    generateEventPanelHTML(event) {
        const eventDate = new Date(event.date);
        const now = new Date();
        const isUpcoming = eventDate > now;
        
        return `
            <div class="immersive-panel-content">
                <div class="immersive-panel-header">
                    <h2 class="immersive-panel-title">
                        ${event.cannabisFriendly ? '🌿' : '🎉'} ${event.title}
                    </h2>
                    <button class="panel-close-btn" id="panel-close">×</button>
                </div>
                
                <div class="panel-event-card">
                    <img src="assets/event-flyer.svg" alt="${event.title}" class="panel-event-image" 
                         onerror="this.style.display='none'">
                    
                    ${isUpcoming ? `
                        <div class="panel-countdown" id="panel-countdown">
                            <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; color: white;">
                                🕒 Event Starts In:
                            </div>
                            <div class="panel-countdown-grid" id="countdown-grid">
                                <div class="panel-countdown-unit">
                                    <div class="panel-countdown-value" id="countdown-days">0</div>
                                    <div class="panel-countdown-label">Days</div>
                                </div>
                                <div class="panel-countdown-unit">
                                    <div class="panel-countdown-value" id="countdown-hours">0</div>
                                    <div class="panel-countdown-label">Hours</div>
                                </div>
                                <div class="panel-countdown-unit">
                                    <div class="panel-countdown-value" id="countdown-minutes">0</div>
                                    <div class="panel-countdown-label">Minutes</div>
                                </div>
                                <div class="panel-countdown-unit">
                                    <div class="panel-countdown-value" id="countdown-seconds">0</div>
                                    <div class="panel-countdown-label">Seconds</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="margin: 1.5rem 0;">
                        <div style="margin-bottom: 1rem; color: white;">
                            <strong style="color: var(--cannabis-green);">📅 Date:</strong>
                            ${eventDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        
                        ${event.venue ? `
                            <div style="margin-bottom: 1rem; color: white;">
                                <strong style="color: var(--cannabis-green);">📍 Venue:</strong>
                                ${event.venue.name}
                            </div>
                            <div style="margin-bottom: 1rem; color: #ccc; font-size: 0.9rem;">
                                ${event.venue.address}
                            </div>
                            ${event.venue.amenities ? `
                                <div style="margin-bottom: 1rem; color: #ccc; font-size: 0.9rem;">
                                    <strong>✨ Amenities:</strong> ${event.venue.amenities.join(', ')}
                                </div>
                            ` : ''}
                        ` : ''}
                        
                        <div style="margin-bottom: 1rem; color: white;">
                            <strong style="color: var(--cannabis-green);">📝 Description:</strong>
                            ${event.description}
                        </div>
                        
                        ${event.category ? `
                            <div style="margin-bottom: 1rem;">
                                <span class="category-badge category-${event.category}">${event.category}</span>
                            </div>
                        ` : ''}
                        
                        ${event.cannabisFriendly ? `
                            <div style="
                                background: rgba(139, 195, 74, 0.2);
                                padding: 1rem;
                                border-radius: 10px;
                                border: 2px solid var(--cannabis-green);
                                text-align: center;
                                margin-top: 1rem;
                            ">
                                <div style="
                                    font-size: 1.2rem;
                                    color: var(--cannabis-green);
                                    font-weight: bold;
                                    margin-bottom: 0.5rem;
                                ">🌿 Cannabis Friendly Event</div>
                                <p style="
                                    margin: 0;
                                    color: #ccc;
                                    font-size: 0.9rem;
                                ">This event welcomes cannabis consumption in accordance with local laws.</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="panel-action-group">
                        <button class="panel-action-btn panel-rsvp-btn" id="panel-rsvp">
                            🎉 Join the Party!
                        </button>
                        <button class="panel-action-btn panel-share-btn" id="panel-share">
                            🔗 Share Event
                        </button>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
                        <button class="social-btn facebook" onclick="window.immersiveOverlay.shareEvent('facebook', '${event.title}')">📘</button>
                        <button class="social-btn twitter" onclick="window.immersiveOverlay.shareEvent('twitter', '${event.title}')">🐦</button>
                        <button class="social-btn instagram" onclick="window.immersiveOverlay.shareEvent('instagram', '${event.title}')">📸</button>
                        <button class="social-btn whatsapp" onclick="window.immersiveOverlay.shareEvent('whatsapp', '${event.title}')">💬</button>
                    </div>
                </div>
                
                <!-- Cannabis leaf decorations -->
                <div style="position: absolute; top: 20px; left: 20px; font-size: 2rem; opacity: 0.3; animation: leafFloat 3s infinite ease-in-out;">🌿</div>
                <div style="position: absolute; bottom: 20px; right: 60px; font-size: 2rem; opacity: 0.3; animation: leafFloat 4s infinite ease-in-out reverse;">🍃</div>
            </div>
        `;
    }

    setupPanelEventListeners(panel, event) {
        // Close button
        panel.querySelector('#panel-close').addEventListener('click', () => this.closePanel());
        
        // RSVP button
        panel.querySelector('#panel-rsvp').addEventListener('click', (e) => this.handleRSVP(e, event));
        
        // Share button
        panel.querySelector('#panel-share').addEventListener('click', () => this.showShareOptions(event));
        
        // Close on background click
        panel.addEventListener('click', (e) => {
            if (e.target === panel) this.closePanel();
        });
        
        // Escape key to close
        document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }

    handleEscapeKey(e) {
        if (e.key === 'Escape' && this.activePanel) {
            this.closePanel();
        }
    }

    handleRSVP(e, event) {
        const button = e.target;
        const originalText = button.textContent;
        
        // Add success animation
        button.style.animation = 'rsvpSuccess 0.6s ease-out';
        button.textContent = '✅ You\'re Going!';
        button.style.background = 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))';
        
        // Create sparkle effect
        this.createSparkleEffect(button);
        
        // Show notification
        this.showNotification(`🎉 You're going to ${event.title}! See you there! 🌿`, 'success', 4000);
        
        // Reset button after animation
        setTimeout(() => {
            button.textContent = '🎉 RSVP Confirmed!';
            button.style.animation = '';
        }, 600);
        
        // Auto-close panel after 2 seconds
        setTimeout(() => this.closePanel(), 2000);
    }

    shareEvent(platform, eventTitle) {
        const eventUrl = encodeURIComponent(window.location.href);
        const eventText = encodeURIComponent(`Join me at ${eventTitle} - A 420-friendly event! 🌿`);
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${eventText}&url=${eventUrl}`,
            instagram: `https://www.instagram.com/`,
            whatsapp: `https://wa.me/?text=${eventText} ${eventUrl}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            this.showNotification(`🔗 Shared ${eventTitle} on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`, 'success');
        }
    }

    showShareOptions(event) {
        this.showNotification('📱 Choose a platform to share this amazing event! 🌿', 'info', 2000);
    }

    startPanelCountdown(eventDate) {
        const targetDate = new Date(eventDate).getTime();
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                const daysEl = document.getElementById('countdown-days');
                const hoursEl = document.getElementById('countdown-hours');
                const minutesEl = document.getElementById('countdown-minutes');
                const secondsEl = document.getElementById('countdown-seconds');
                
                if (daysEl) daysEl.textContent = days;
                if (hoursEl) hoursEl.textContent = hours;
                if (minutesEl) minutesEl.textContent = minutes;
                if (secondsEl) secondsEl.textContent = seconds;
            }
        };
        
        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    closePanel() {
        if (this.activePanel) {
            this.activePanel.classList.remove('active');
            
            // Clear countdown interval
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
            
            setTimeout(() => {
                if (this.activePanel) {
                    this.activePanel.remove();
                    this.activePanel = null;
                }
            }, 600);
            
            // Remove escape key listener
            document.removeEventListener('keydown', this.handleEscapeKey);
        }
    }

    setupEventListeners() {
        // Handle event card clicks
        document.addEventListener('click', (e) => {
            const eventCard = e.target.closest('.event-card');
            if (eventCard && !e.target.closest('.action-btn')) {
                // Get event data from the card
                const event = this.extractEventDataFromCard(eventCard);
                this.showEventPanel(event);
            }
        });
    }

    extractEventDataFromCard(eventCard) {
        // Extract event data from the existing event card
        const title = eventCard.querySelector('.event-title')?.textContent || 'Event';
        const description = eventCard.querySelector('.event-desc')?.textContent || '';
        const date = eventCard.querySelector('.event-date')?.textContent || '';
        const venueElement = eventCard.querySelector('.venue-info');
        const categoryElement = eventCard.querySelector('.category-badge');
        const cannabisFriendly = eventCard.classList.contains('cannabis-friendly');
        
        let venue = null;
        if (venueElement) {
            const venueName = venueElement.querySelector('.venue-name')?.textContent || '';
            const venueAddress = venueElement.querySelector('.venue-address')?.textContent || '';
            const amenitiesElement = venueElement.querySelector('.venue-amenities');
            const amenities = amenitiesElement ? 
                amenitiesElement.textContent.replace('✨ ', '').split(', ') : [];
            
            venue = {
                name: venueName,
                address: venueAddress,
                amenities: amenities
            };
        }
        
        return {
            title,
            description,
            date,
            venue,
            category: categoryElement?.textContent || '',
            cannabisFriendly
        };
    }
}

// Initialize the immersive overlay system
document.addEventListener('DOMContentLoaded', () => {
    window.immersiveOverlay = new ImmersiveOverlaySystem();
});

// Legacy support for existing functions
function showEventDetails(event) {
    if (window.immersiveOverlay) {
        window.immersiveOverlay.showEventPanel(event);
    }
}

function handleRSVP() {
    if (window.immersiveOverlay) {
        window.immersiveOverlay.showNotification(
            '🎉 You\'re going to this amazing event! See you there! 🌿', 
            'success', 
            3000
        );
    }
}

function closeLandingModal() {
    if (window.immersiveOverlay && window.immersiveOverlay.activePanel) {
        window.immersiveOverlay.closePanel();
    }
    
    // Hide the old modal
    const oldModal = document.getElementById('landing-modal');
    if (oldModal) {
        oldModal.style.display = 'none';
    }
}

function shareEvent(platform) {
    if (window.immersiveOverlay) {
        window.immersiveOverlay.shareEvent(platform, 'Cannabis Education & Wellness Fair');
    }
}