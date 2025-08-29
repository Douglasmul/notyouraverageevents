const { useState, useEffect, createElement: h } = React;

function App() {
    const [currentView, setCurrentView] = useState('events');
    const [showLandingModal, setShowLandingModal] = useState(true);
    const [showProfileDrawer, setShowProfileDrawer] = useState(false);
    const [events, setEvents] = useState(window.APP_DATA?.events || []);
    const [venues, setVenues] = useState(window.APP_DATA?.venues || []);
    const [users, setUsers] = useState(window.APP_DATA?.users || []);
    const [currentUser, setCurrentUser] = useState(window.APP_DATA?.users?.[0] || null);

    useEffect(() => {
        // Update data when it's loaded
        if (window.APP_DATA) {
            setEvents(window.APP_DATA.events);
            setVenues(window.APP_DATA.venues);
            setUsers(window.APP_DATA.users);
            setCurrentUser(window.APP_DATA.users[0]);
        }
    }, []);

    const handleRSVP = (eventId, status) => {
        setEvents(prevEvents => 
            prevEvents.map(event => 
                event.title === eventId 
                    ? { ...event, rsvpStatus: status, rsvpCount: (event.rsvpCount || 0) + (status === 'going' ? 1 : -1) }
                    : event
            )
        );
    };

    const handleLike = (eventId) => {
        setEvents(prevEvents => 
            prevEvents.map(event => 
                event.title === eventId 
                    ? { ...event, likes: (event.likes || 0) + 1, isLiked: !event.isLiked }
                    : event
            )
        );
    };

    const navItems = [
        { id: 'events', label: '🌿 Events Feed', icon: '🎉' },
        { id: 'community', label: '💬 Community Board', icon: '🌱' },
        { id: 'profile', label: '👤 My Profile', icon: '🏆' },
        { id: 'add-event', label: '➕ Create Event', icon: '📅' }
    ];

    return h('div', { className: 'app-container' },
        // Header
        h('header', { className: 'app-header' },
            h('h1', { className: 'app-title glow-text' }, 
                h('span', { className: 'cannabis-icon' }, '🌿'), 
                ' Not Your Average Events'
            ),
            h('p', { className: 'app-subtitle' }, '420-Friendly Social Network & Events Platform')
        ),

        // Landing Modal
        showLandingModal && h(LandingModal, {
            events,
            onClose: () => setShowLandingModal(false),
            onRSVP: handleRSVP
        }),

        // Main Content
        h('main', { className: 'main-content' },
            // Navigation
            h('nav', { className: 'main-nav' },
                h('div', { className: 'profile-quick-view' },
                    currentUser && h('div', null,
                        h('div', { className: 'user-avatar' }, currentUser.avatar),
                        h('div', { className: 'user-info' },
                            h('div', { className: 'user-name' }, currentUser.name),
                            h('div', { className: 'user-status' }, 
                                `${currentUser.engagementLevel} • ${currentUser.points} points`
                            ),
                            h('div', { className: 'user-badges' },
                                currentUser.badges.slice(0, 2).map(badge =>
                                    h('span', { key: badge, className: 'badge' }, badge)
                                )
                            )
                        )
                    )
                ),
                
                navItems.map(item =>
                    h('button', {
                        key: item.id,
                        className: `nav-item ${currentView === item.id ? 'active' : ''}`,
                        onClick: () => {
                            setCurrentView(item.id);
                            if (item.id === 'profile') {
                                setShowProfileDrawer(true);
                            }
                        }
                    }, `${item.icon} ${item.label}`)
                )
            ),

            // Content Area
            h('div', { className: 'content-area' },
                currentView === 'events' && h(EventsFeed, {
                    events,
                    onRSVP: handleRSVP,
                    onLike: handleLike,
                    users
                }),
                
                currentView === 'community' && h(CommunityBoard, {
                    users,
                    events
                }),
                
                currentView === 'add-event' && h('div', { className: 'add-event-form' },
                    h('h2', null, '🌿 Create Cannabis-Friendly Event'),
                    h('p', null, 'Share your 420-friendly gathering with the community!')
                )
            )
        ),

        // Profile Drawer
        showProfileDrawer && h(ProfileDrawer, {
            user: currentUser,
            users,
            onClose: () => setShowProfileDrawer(false)
        })
    );
}

// Make App available globally
window.App = App;