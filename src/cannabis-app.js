// Cannabis-Themed Social Network App
let allEvents = [];
let allVenues = [];
let currentView = 'events';
let currentFeedFilter = 'upcoming';

// App Data
const APP_DATA = {
    events: [],
    venues: [],
    users: [
        {
            id: 1,
            name: "Sarah Green",
            avatar: "🌿",
            favoriteStrains: ["Purple Haze", "Girl Scout Cookies"],
            lastRSVP: "Cannabis Education & Wellness Fair",
            engagementLevel: "Gold Leaf",
            points: 420,
            badges: ["Event Host", "Community Leader", "Strain Expert"]
        },
        {
            id: 2, 
            name: "Mike Blazer",
            avatar: "🔥",
            favoriteStrains: ["OG Kush", "Blue Dream"],
            lastRSVP: "420 Friendly Art & Music Night",
            engagementLevel: "Silver Leaf",
            points: 280,
            badges: ["Music Lover", "Art Enthusiast"]
        },
        {
            id: 3,
            name: "Luna Wellness",
            avatar: "🧘‍♀️",
            favoriteStrains: ["CBD Flower", "Lavender Kush"],
            lastRSVP: "Meditation & Cannabis Mindfulness Session",
            engagementLevel: "Gold Leaf",
            points: 350,
            badges: ["Wellness Guru", "Mindfulness Master"]
        }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    startCountdown();
    setupSwipeListeners();
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
        APP_DATA.events = allEvents;
        APP_DATA.venues = allVenues;
        
        displayEvents(allEvents);
        updateNextEventInfo();
        loadCommunityContent();
        
        // Show welcome notification instead of modal
        setTimeout(() => {
            if (window.immersiveOverlay) {
                window.immersiveOverlay.showNotification(
                    '🌿 Welcome to Not Your Average Events! Click any event to explore! 🎉', 
                    'success', 
                    4000
                );
            }
        }, 1000);
    } catch (err) {
        console.error('Failed to load app data:', err);
        // Fallback to sample data
        displayEvents([]);
    }
}

// Landing Modal Functions
function closeLandingModal() {
    document.getElementById('landing-modal').style.display = 'none';
}

function handleRSVP() {
    const button = event.target;
    button.textContent = '✅ You\'re Going!';
    button.style.background = 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))';
    
    // Show confirmation
    setTimeout(() => {
        button.textContent = '🎉 RSVP Confirmed!';
    }, 1000);
    
    setTimeout(() => {
        closeLandingModal();
    }, 2000);
}

function shareEvent(platform) {
    const eventUrl = encodeURIComponent(window.location.href);
    const eventText = encodeURIComponent('Join me at this amazing 420-friendly event! 🌿');
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${eventText}&url=${eventUrl}`,
        instagram: `https://www.instagram.com/`,
        whatsapp: `https://wa.me/?text=${eventText} ${eventUrl}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Countdown Timer
function startCountdown() {
    const nextEventDate = new Date('2025-09-25T18:00:00'); // Example date
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = nextEventDate.getTime() - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
        } else {
            document.getElementById('countdown-display').innerHTML = 
                '<div class="countdown-unit"><div class="countdown-value">🎉</div><div class="countdown-label">Event Started!</div></div>';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Update next event info in modal
function updateNextEventInfo() {
    if (allEvents.length === 0) return;
    
    const now = new Date();
    const upcomingEvents = allEvents
        .filter(event => event.cannabisFriendly && new Date(event.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const nextEvent = upcomingEvents[0] || allEvents.find(e => e.cannabisFriendly) || allEvents[0];
    
    if (nextEvent) {
        document.getElementById('next-event-title').textContent = nextEvent.title;
        document.getElementById('next-event-date').textContent = new Date(nextEvent.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('next-event-venue').textContent = nextEvent.venue?.name || 'TBA';
        document.getElementById('next-event-description').textContent = nextEvent.description;
    }
}

// Navigation Functions
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Remove active state from nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected view and activate corresponding button
    document.getElementById(`${viewName}-view`).classList.add('active');
    event.target.classList.add('active');
    
    currentView = viewName;
}

function showProfile() {
    document.getElementById('profile-drawer').style.display = 'flex';
    loadProfileContent();
}

function closeProfile() {
    document.getElementById('profile-drawer').style.display = 'none';
}

// Events Feed Functions
function filterEvents(type) {
    currentFeedFilter = type;
    
    // Update tab appearance
    document.querySelectorAll('.feed-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const now = new Date();
    let filteredEvents;
    
    switch (type) {
        case 'upcoming':
            filteredEvents = allEvents.filter(event => new Date(event.date) >= now);
            break;
        case 'trending':
            filteredEvents = allEvents.filter(event => event.cannabisFriendly || Math.random() > 0.5);
            break;
        case 'past':
            filteredEvents = allEvents.filter(event => new Date(event.date) < now);
            break;
        default:
            filteredEvents = allEvents;
    }
    
    displayEvents(filteredEvents);
}

function displayEvents(events) {
    const eventsList = document.getElementById('events-list');
    
    if (events.length === 0) {
        eventsList.innerHTML = `
            <div class="no-events">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🌿</div>
                <h3>No events found</h3>
                <p>Check back later for more cannabis-friendly events!</p>
            </div>
        `;
        return;
    }
    
    eventsList.innerHTML = events.map((event, index) => createEventCard(event, index)).join('');
}

function createEventCard(event, index) {
    const isLiked = event.isLiked || false;
    const likeCount = event.likes || Math.floor(Math.random() * 15) + 1;
    const rsvpCount = event.rsvpCount || Math.floor(Math.random() * 25) + 5;
    const commentCount = event.comments || Math.floor(Math.random() * 10) + 1;
    
    return `
        <div class="event-card ${event.cannabisFriendly ? 'cannabis-friendly' : ''}" 
             style="animation: slideIn 0.5s ease-out ${index * 0.1}s both;"
             data-event-title="${event.title}">
            
            ${event.cannabisFriendly ? '<div class="cannabis-leaf-decoration">🌿</div>' : ''}
            
            <div class="event-card-header">
                <div class="event-info">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-badges">
                        <span class="category-badge">${event.category}</span>
                        ${event.cannabisFriendly ? '<span class="cannabis-indicator">🌿 Cannabis Friendly</span>' : ''}
                    </div>
                    <div class="event-date">
                        📅 ${new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                </div>
                
                <div class="top-poster-badge" title="Top Poster: ${APP_DATA.users[0].name}">
                    ${APP_DATA.users[0].avatar}
                </div>
            </div>
            
            <p class="event-description">${event.description}</p>
            
            ${event.venue ? `
                <div class="venue-info">
                    <div class="venue-name">📍 ${event.venue.name}</div>
                    <div class="venue-address">${event.venue.address}</div>
                    ${event.venue.amenities ? `<div class="venue-amenities">✨ ${event.venue.amenities.join(', ')}</div>` : ''}
                </div>
            ` : ''}
            
            <div class="event-actions">
                <button class="action-btn rsvp-btn" onclick="handleEventRSVP('${event.title}')">
                    🎉 RSVP (${rsvpCount})
                </button>
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" onclick="handleEventLike('${event.title}')">
                    ${isLiked ? '💚' : '🤍'} Like (${likeCount})
                </button>
                <button class="action-btn comment-btn" onclick="toggleComments('${event.title}')">
                    💬 Comments (${commentCount})
                </button>
            </div>
            
            <div class="comments-section" id="comments-${event.title.replace(/\s+/g, '-')}" style="display: none;">
                <div class="add-comment">
                    <input type="text" placeholder="Add a comment..." class="comment-input">
                    <button class="post-comment-btn" onclick="postComment('${event.title}')">🌿 Post</button>
                </div>
                <div class="comments-list">
                    ${generateSampleComments(event.title)}
                </div>
            </div>
            
            <div class="swipe-instructions">
                👈 Swipe left to like • Swipe right to RSVP 👉
            </div>
        </div>
    `;
}

function generateSampleComments(eventTitle) {
    const sampleComments = [
        "Can't wait for this! 🌿",
        "This sounds amazing! Will definitely be there 🎉",
        "Love these cannabis-friendly events! 💚",
        "Hope to see some familiar faces there 😊"
    ];
    
    return sampleComments.slice(0, Math.floor(Math.random() * 3) + 1).map((comment, index) => {
        const user = APP_DATA.users[index % APP_DATA.users.length];
        return `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-avatar">${user.avatar}</span>
                    <strong class="comment-author">${user.name}</strong>
                    <span class="comment-time">${Math.floor(Math.random() * 60) + 1}m ago</span>
                </div>
                <p class="comment-text">${comment}</p>
            </div>
        `;
    }).join('');
}

// Enhanced Event Interaction Functions
function handleEventRSVP(eventTitle) {
    const button = event.target;
    const currentCount = parseInt(button.textContent.match(/\d+/)?.[0] || 0);
    
    // Add pulse animation
    button.style.animation = 'rsvpSuccess 0.6s ease-out';
    button.innerHTML = `🎉 Joining... (${currentCount + 1})`;
    button.style.background = 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))';
    button.style.transform = 'scale(1.1)';
    
    // Add floating success emoji
    createFloatingEmoji('🎉', button);
    
    // Show notification
    if (window.immersiveOverlay) {
        window.immersiveOverlay.showNotification(
            `🎉 You're going to ${eventTitle}! See you there! 🌿`, 
            'success', 
            3000
        );
    }
    
    setTimeout(() => {
        button.innerHTML = `✅ Going (${currentCount + 1})`;
        button.style.transform = 'scale(1)';
        
        setTimeout(() => {
            button.innerHTML = `🎉 RSVP (${currentCount + 1})`;
            button.style.background = 'linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green))';
            button.style.animation = '';
        }, 1500);
    }, 800);
}

function handleEventLike(eventTitle) {
    const button = event.target;
    const isLiked = button.classList.contains('liked');
    const currentCount = parseInt(button.textContent.match(/\d+/)[0]);
    
    // Add heart animation
    button.style.animation = 'heartBeat 0.5s ease-out';
    
    if (!isLiked) {
        button.classList.add('liked');
        button.innerHTML = `💚 Liked (${currentCount + 1})`;
        button.style.background = 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))';
        
        // Add floating heart emoji
        createFloatingEmoji('💚', button);
        
        // Create sparkle effect
        createSparkleEffect(button);
    } else {
        button.classList.remove('liked');
        button.innerHTML = `🤍 Like (${currentCount - 1})`;
        button.style.background = 'linear-gradient(45deg, var(--cannabis-purple), #673ab7)';
    }
    
    setTimeout(() => {
        button.style.animation = '';
    }, 500);
}

// Enhanced visual effects
function createFloatingEmoji(emoji, element) {
    const floatingEmoji = document.createElement('div');
    floatingEmoji.textContent = emoji;
    floatingEmoji.style.cssText = `
        position: absolute;
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 2s ease-out forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    floatingEmoji.style.left = (rect.left + rect.width / 2) + 'px';
    floatingEmoji.style.top = rect.top + 'px';
    
    document.body.appendChild(floatingEmoji);
    
    setTimeout(() => {
        document.body.removeChild(floatingEmoji);
    }, 2000);
}

function createSparkleEffect(element) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.cssText = `
                position: absolute;
                font-size: 1rem;
                pointer-events: none;
                z-index: 999;
                animation: sparkle 1s ease-out forwards;
            `;
            
            const rect = element.getBoundingClientRect();
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                document.body.removeChild(sparkle);
            }, 1000);
        }, i * 100);
    }
}

function toggleComments(eventTitle) {
    const commentsSection = document.getElementById(`comments-${eventTitle.replace(/\s+/g, '-')}`);
    const isVisible = commentsSection.style.display !== 'none';
    commentsSection.style.display = isVisible ? 'none' : 'block';
}

function postComment(eventTitle) {
    const input = event.target.parentNode.querySelector('.comment-input');
    const comment = input.value.trim();
    
    if (!comment) return;
    
    const commentsList = event.target.parentNode.nextElementSibling;
    const user = APP_DATA.users[0]; // Current user
    
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <div class="comment-header">
            <span class="comment-avatar">${user.avatar}</span>
            <strong class="comment-author">${user.name}</strong>
            <span class="comment-time">just now</span>
        </div>
        <p class="comment-text">${comment}</p>
    `;
    
    commentsList.insertBefore(commentElement, commentsList.firstChild);
    input.value = '';
    
    // Update comment count
    const commentBtn = event.target.parentNode.parentNode.querySelector('.comment-btn');
    const currentCount = parseInt(commentBtn.textContent.match(/\d+/)[0]);
    commentBtn.innerHTML = `💬 Comments (${currentCount + 1})`;
}

// Community Board Functions
function showCommunityTab(tabName) {
    document.querySelectorAll('.community-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadCommunityContent(tabName);
}

function loadCommunityContent(tabName = 'discussions') {
    const contentDiv = document.getElementById('community-content');
    
    switch (tabName) {
        case 'discussions':
            contentDiv.innerHTML = createDiscussionsContent();
            break;
        case 'polls':
            contentDiv.innerHTML = createPollsContent();
            break;
        case 'qa':
            contentDiv.innerHTML = createQAContent();
            break;
    }
}

function createDiscussionsContent() {
    return `
        <div class="new-discussion-form">
            <h3>🌱 Start a Discussion</h3>
            <input type="text" placeholder="Discussion title..." class="discussion-title-input">
            <select class="discussion-category-select">
                <option value="general">💬 General</option>
                <option value="strains">🌱 Strains</option>
                <option value="venues">📍 Venues</option>
                <option value="events">🎉 Events</option>
                <option value="wellness">🧘‍♀️ Wellness</option>
                <option value="legal">⚖️ Legal</option>
            </select>
            <textarea placeholder="Share your thoughts..." rows="3" class="discussion-content-input"></textarea>
            <button class="cannabis-btn" onclick="postDiscussion()">🌿 Post Discussion</button>
        </div>
        
        <div class="discussions-list">
            ${generateSampleDiscussions()}
        </div>
    `;
}

function createPollsContent() {
    return `
        <div class="new-poll-form">
            <h3>📊 Create a Poll</h3>
            <input type="text" placeholder="Poll question..." class="poll-question-input">
            <div class="poll-options">
                <input type="text" placeholder="Option 1..." class="poll-option-input">
                <input type="text" placeholder="Option 2..." class="poll-option-input">
            </div>
            <button class="add-option-btn" onclick="addPollOption()">➕ Add Option</button>
            <button class="cannabis-btn" onclick="createPoll()">📊 Create Poll</button>
        </div>
        
        <div class="polls-list">
            ${generateSamplePolls()}
        </div>
    `;
}

function createQAContent() {
    return `
        <div class="qa-content">
            <h3>❓ Event Planning Q&A</h3>
            <div class="faq-section">
                <h4>🌿 Frequently Asked Questions</h4>
                <div class="faq-item">
                    <strong>Q: How do I organize a cannabis-friendly event?</strong>
                    <p>A: Check local laws, get proper permits, choose cannabis-friendly venues, and ensure good ventilation.</p>
                </div>
                <div class="faq-item">
                    <strong>Q: What should I bring to a 420 event?</strong>
                    <p>A: Bring your own cannabis (if legal), water, snacks, and a positive attitude! Some events provide consumption options.</p>
                </div>
                <div class="faq-item">
                    <strong>Q: Are there age restrictions?</strong>
                    <p>A: Yes, all cannabis events are 21+ (or 18+ in medical states). Valid ID required.</p>
                </div>
            </div>
            <button class="cannabis-btn">🌱 Ask a Question</button>
        </div>
    `;
}

function generateSampleDiscussions() {
    const discussions = [
        {
            title: "Best strains for creativity?",
            author: APP_DATA.users[0],
            category: "strains",
            content: "Looking for recommendations for strains that help with creative projects. What are your favorites?",
            replies: 8,
            likes: 12,
            timeAgo: "2h ago"
        },
        {
            title: "Cannabis-friendly venues in downtown",
            author: APP_DATA.users[1],
            category: "venues",
            content: "Does anyone know good spots downtown where we can consume? Looking for recommendations.",
            replies: 15,
            likes: 25,
            timeAgo: "30m ago"
        }
    ];
    
    return discussions.map(discussion => `
        <div class="discussion-card">
            <div class="discussion-header">
                <h4>${discussion.title}</h4>
                <div class="discussion-meta">
                    <span class="category-badge">${discussion.category}</span>
                    <span class="discussion-author">${discussion.author.avatar} ${discussion.author.name}</span>
                    <span class="discussion-time">${discussion.timeAgo}</span>
                </div>
            </div>
            <p>${discussion.content}</p>
            <div class="discussion-stats">
                <span>💬 ${discussion.replies} replies</span>
                <span>💚 ${discussion.likes} likes</span>
            </div>
        </div>
    `).join('');
}

function generateSamplePolls() {
    return `
        <div class="poll-card">
            <div class="poll-header">
                <span class="poll-avatar">${APP_DATA.users[0].avatar}</span>
                <div class="poll-info">
                    <h4>What's your preferred consumption method?</h4>
                    <span class="poll-author">by ${APP_DATA.users[0].name} • 120 votes</span>
                </div>
            </div>
            <div class="poll-options">
                <div class="poll-option" onclick="votePoll(this, 45, 120)">
                    <div class="option-bar" style="width: 38%"></div>
                    <span class="option-text">Smoking</span>
                    <span class="option-percentage">38% (45)</span>
                </div>
                <div class="poll-option" onclick="votePoll(this, 32, 120)">
                    <div class="option-bar" style="width: 27%"></div>
                    <span class="option-text">Vaping</span>
                    <span class="option-percentage">27% (32)</span>
                </div>
                <div class="poll-option" onclick="votePoll(this, 28, 120)">
                    <div class="option-bar" style="width: 23%"></div>
                    <span class="option-text">Edibles</span>
                    <span class="option-percentage">23% (28)</span>
                </div>
                <div class="poll-option" onclick="votePoll(this, 15, 120)">
                    <div class="option-bar" style="width: 12%"></div>
                    <span class="option-text">Dabbing</span>
                    <span class="option-percentage">12% (15)</span>
                </div>
            </div>
        </div>
    `;
}

function votePoll(optionElement, currentVotes, totalVotes) {
    const newVotes = currentVotes + 1;
    const newTotal = totalVotes + 1;
    const newPercentage = Math.round((newVotes / newTotal) * 100);
    
    optionElement.querySelector('.option-bar').style.width = newPercentage + '%';
    optionElement.querySelector('.option-percentage').textContent = `${newPercentage}% (${newVotes})`;
    
    // Update total in header
    const pollCard = optionElement.closest('.poll-card');
    pollCard.querySelector('.poll-author').textContent = 
        pollCard.querySelector('.poll-author').textContent.replace(/\d+ votes/, `${newTotal} votes`);
}

// Profile Functions
function loadProfileContent() {
    const profileDrawer = document.querySelector('.profile-drawer');
    const user = APP_DATA.users[0]; // Current user
    
    profileDrawer.innerHTML = `
        <button class="close-btn" onclick="closeProfile()">×</button>
        
        <div class="profile-header">
            <div class="profile-avatar">${user.avatar}</div>
            <h2 class="glow-text">${user.name}</h2>
            <div class="profile-level">${user.engagementLevel} • ${user.points} Points</div>
            <div class="profile-last-rsvp">Last RSVP: ${user.lastRSVP}</div>
        </div>
        
        <div class="profile-tabs">
            <button class="profile-tab active" onclick="showProfileTab('profile')">👤 Profile</button>
            <button class="profile-tab" onclick="showProfileTab('leaderboard')">🏆 Leaderboard</button>
        </div>
        
        <div id="profile-content">
            ${createProfileTabContent()}
        </div>
    `;
}

function showProfileTab(tabName) {
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const content = tabName === 'profile' ? createProfileTabContent() : createLeaderboardContent();
    document.getElementById('profile-content').innerHTML = content;
}

function createProfileTabContent() {
    const user = APP_DATA.users[0];
    
    return `
        <div class="favorite-strains">
            <h3>🌿 Favorite Strains</h3>
            <div class="strains-grid">
                ${user.favoriteStrains.map(strain => `
                    <div class="strain-card">🌱 ${strain}</div>
                `).join('')}
            </div>
        </div>
        
        <div class="achievement-badges">
            <h3>🏆 Achievement Badges</h3>
            <div class="badges-grid">
                ${user.badges.map(badge => `
                    <div class="achievement-badge">⭐ ${badge}</div>
                `).join('')}
            </div>
        </div>
        
        <div class="activity-stats">
            <h3>📊 Activity Stats</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${Math.floor(Math.random() * 20) + 5}</div>
                    <div class="stat-label">Events Attended</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.floor(Math.random() * 50) + 10}</div>
                    <div class="stat-label">Comments Posted</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.floor(Math.random() * 30) + 5}</div>
                    <div class="stat-label">Events Liked</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.floor(Math.random() * 15) + 3}</div>
                    <div class="stat-label">Friends Made</div>
                </div>
            </div>
        </div>
    `;
}

function createLeaderboardContent() {
    const sortedUsers = [...APP_DATA.users].sort((a, b) => b.points - a.points);
    
    return `
        <div class="leaderboard">
            <h3>🏆 Community Leaderboard</h3>
            <div class="leaderboard-list">
                ${sortedUsers.map((user, index) => `
                    <div class="leaderboard-item ${user.id === 1 ? 'current-user' : ''}">
                        <div class="rank">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</div>
                        <div class="user-avatar">${user.avatar}</div>
                        <div class="user-info">
                            <div class="user-name">${user.name}</div>
                            <div class="user-level">${user.engagementLevel}</div>
                        </div>
                        <div class="user-points">
                            <div class="points">${user.points}</div>
                            <div class="points-label">points</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Swipe Functionality
function setupSwipeListeners() {
    let startX = null;
    let startY = null;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Only handle horizontal swipes on event cards
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const eventCard = e.target.closest('.event-card');
            if (eventCard) {
                const eventTitle = eventCard.dataset.eventTitle;
                
                if (diffX > 0) {
                    // Left swipe - like
                    handleEventLike(eventTitle);
                } else {
                    // Right swipe - RSVP
                    handleEventRSVP(eventTitle);
                }
                
                startX = null;
                startY = null;
            }
        }
    });
}