const { useState, createElement: h } = React;

function CommunityBoard({ users, events }) {
    const [activeTab, setActiveTab] = useState('discussions');
    const [discussions, setDiscussions] = useState([
        {
            id: 1,
            title: "Best strains for creativity?",
            author: users[0],
            replies: 8,
            lastReply: new Date(Date.now() - 2 * 60 * 60 * 1000),
            category: "strains",
            content: "Looking for recommendations for strains that help with creative projects. What are your favorites?",
            likes: 12
        },
        {
            id: 2,
            title: "Cannabis-friendly venues in downtown",
            author: users[1],
            replies: 15,
            lastReply: new Date(Date.now() - 30 * 60 * 1000),
            category: "venues",
            content: "Does anyone know good spots downtown where we can consume? Looking for recommendations.",
            likes: 25
        },
        {
            id: 3,
            title: "Event planning - 420 Art Gallery Night",
            author: users[2],
            replies: 3,
            lastReply: new Date(Date.now() - 4 * 60 * 60 * 1000),
            category: "events",
            content: "Planning an art gallery night with cannabis consumption. Need advice on logistics and permits.",
            likes: 7
        }
    ]);

    const [polls, setPolls] = useState([
        {
            id: 1,
            question: "What's your preferred consumption method?",
            options: [
                { text: "Smoking", votes: 45 },
                { text: "Vaping", votes: 32 },
                { text: "Edibles", votes: 28 },
                { text: "Dabbing", votes: 15 }
            ],
            totalVotes: 120,
            author: users[0],
            endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
            id: 2,
            question: "Best time for cannabis events?",
            options: [
                { text: "Evening (6-10 PM)", votes: 38 },
                { text: "Afternoon (2-6 PM)", votes: 25 },
                { text: "Late Night (10 PM+)", votes: 20 },
                { text: "Weekend Daytime", votes: 22 }
            ],
            totalVotes: 105,
            author: users[1],
            endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
    ]);

    const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', category: 'general' });
    const [newPoll, setNewPoll] = useState({ 
        question: '', 
        options: ['', ''], 
        category: 'general' 
    });

    const addDiscussion = () => {
        if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;
        
        const discussion = {
            id: discussions.length + 1,
            title: newDiscussion.title,
            content: newDiscussion.content,
            category: newDiscussion.category,
            author: users[0], // Current user
            replies: 0,
            lastReply: new Date(),
            likes: 0
        };
        
        setDiscussions([discussion, ...discussions]);
        setNewDiscussion({ title: '', content: '', category: 'general' });
    };

    const addPoll = () => {
        if (!newPoll.question.trim() || newPoll.options.filter(o => o.trim()).length < 2) return;
        
        const poll = {
            id: polls.length + 1,
            question: newPoll.question,
            options: newPoll.options.filter(o => o.trim()).map(text => ({ text, votes: 0 })),
            totalVotes: 0,
            author: users[0],
            endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };
        
        setPolls([poll, ...polls]);
        setNewPoll({ question: '', options: ['', ''], category: 'general' });
    };

    const votePoll = (pollId, optionIndex) => {
        setPolls(prevPolls =>
            prevPolls.map(poll =>
                poll.id === pollId
                    ? {
                        ...poll,
                        options: poll.options.map((option, index) =>
                            index === optionIndex
                                ? { ...option, votes: option.votes + 1 }
                                : option
                        ),
                        totalVotes: poll.totalVotes + 1
                    }
                    : poll
            )
        );
    };

    const likeDiscussion = (discussionId) => {
        setDiscussions(prevDiscussions =>
            prevDiscussions.map(discussion =>
                discussion.id === discussionId
                    ? { ...discussion, likes: discussion.likes + 1 }
                    : discussion
            )
        );
    };

    const getCategoryIcon = (category) => {
        const icons = {
            strains: '🌱',
            venues: '📍',
            events: '🎉',
            general: '💬',
            wellness: '🧘‍♀️',
            legal: '⚖️'
        };
        return icons[category] || '💬';
    };

    const getCategoryColor = (category) => {
        const colors = {
            strains: 'var(--cannabis-green)',
            venues: 'var(--cannabis-purple)',
            events: 'var(--cannabis-gold)',
            general: 'var(--cannabis-orange)',
            wellness: '#4caf50',
            legal: '#607d8b'
        };
        return colors[category] || 'var(--cannabis-green)';
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInMinutes < 24 * 60) {
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
            return `${Math.floor(diffInMinutes / (24 * 60))}d ago`;
        }
    };

    return h('div', { className: 'community-board' },
        // Header
        h('div', {
            style: {
                background: 'var(--cannabis-bg-medium)',
                padding: '1.5rem',
                borderRadius: '15px',
                marginBottom: '2rem',
                border: '2px solid var(--cannabis-green)',
                textAlign: 'center'
            }
        },
            h('h2', {
                className: 'glow-text',
                style: { margin: '0 0 0.5rem 0' }
            }, '🌿 420-Friendly Community Board'),
            h('p', {
                style: {
                    color: '#ccc',
                    margin: 0,
                    fontSize: '1.1rem'
                }
            }, 'Connect, discuss, and plan with fellow cannabis enthusiasts')
        ),

        // Tab Navigation
        h('div', {
            style: {
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }
        },
            ['discussions', 'polls', 'qa'].map(tab =>
                h('button', {
                    key: tab,
                    onClick: () => setActiveTab(tab),
                    style: {
                        padding: '0.8rem 1.5rem',
                        borderRadius: '25px',
                        border: '2px solid var(--cannabis-green)',
                        background: activeTab === tab 
                            ? 'var(--cannabis-green)' 
                            : 'transparent',
                        color: activeTab === tab ? 'white' : 'var(--cannabis-green)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }
                }, 
                    tab === 'discussions' ? '💬 Discussions' :
                    tab === 'polls' ? '📊 Polls' :
                    '❓ Q&A'
                )
            )
        ),

        // Discussions Tab
        activeTab === 'discussions' && h('div', null,
            // New Discussion Form
            h('div', {
                style: {
                    background: 'var(--cannabis-bg-medium)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    marginBottom: '2rem',
                    border: '2px solid var(--cannabis-green)'
                }
            },
                h('h3', {
                    style: {
                        color: 'var(--cannabis-green)',
                        marginBottom: '1rem'
                    }
                }, '🌱 Start a Discussion'),
                
                h('div', {
                    style: { marginBottom: '1rem' }
                },
                    h('input', {
                        type: 'text',
                        placeholder: 'Discussion title...',
                        value: newDiscussion.title,
                        onChange: (e) => setNewDiscussion({ ...newDiscussion, title: e.target.value }),
                        style: {
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '2px solid var(--cannabis-green)',
                            background: 'var(--cannabis-bg-dark)',
                            color: 'white',
                            fontSize: '1rem'
                        }
                    })
                ),
                
                h('div', {
                    style: { marginBottom: '1rem' }
                },
                    h('select', {
                        value: newDiscussion.category,
                        onChange: (e) => setNewDiscussion({ ...newDiscussion, category: e.target.value }),
                        style: {
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '2px solid var(--cannabis-green)',
                            background: 'var(--cannabis-bg-dark)',
                            color: 'white',
                            marginRight: '1rem'
                        }
                    },
                        h('option', { value: 'general' }, '💬 General'),
                        h('option', { value: 'strains' }, '🌱 Strains'),
                        h('option', { value: 'venues' }, '📍 Venues'),
                        h('option', { value: 'events' }, '🎉 Events'),
                        h('option', { value: 'wellness' }, '🧘‍♀️ Wellness'),
                        h('option', { value: 'legal' }, '⚖️ Legal')
                    )
                ),
                
                h('div', {
                    style: { marginBottom: '1rem' }
                },
                    h('textarea', {
                        placeholder: 'Share your thoughts...',
                        value: newDiscussion.content,
                        onChange: (e) => setNewDiscussion({ ...newDiscussion, content: e.target.value }),
                        rows: 3,
                        style: {
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '2px solid var(--cannabis-green)',
                            background: 'var(--cannabis-bg-dark)',
                            color: 'white',
                            fontSize: '1rem',
                            resize: 'vertical'
                        }
                    })
                ),
                
                h('button', {
                    onClick: addDiscussion,
                    className: 'cannabis-btn',
                    style: {
                        background: 'linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green))',
                        border: '2px solid var(--cannabis-gold)'
                    }
                }, '🌿 Post Discussion')
            ),

            // Discussions List
            h('div', {
                style: { display: 'grid', gap: '1rem' }
            },
                discussions.map(discussion =>
                    h('div', {
                        key: discussion.id,
                        style: {
                            background: 'var(--cannabis-bg-medium)',
                            padding: '1.5rem',
                            borderRadius: '15px',
                            border: `2px solid ${getCategoryColor(discussion.category)}`,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }
                    },
                        h('div', {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '1rem'
                            }
                        },
                            h('div', { style: { flex: 1 } },
                                h('h4', {
                                    style: {
                                        color: 'white',
                                        margin: '0 0 0.5rem 0',
                                        fontSize: '1.2rem'
                                    }
                                }, discussion.title),
                                
                                h('div', {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        flexWrap: 'wrap'
                                    }
                                },
                                    h('span', {
                                        style: {
                                            background: getCategoryColor(discussion.category),
                                            color: 'white',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '15px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }
                                    }, `${getCategoryIcon(discussion.category)} ${discussion.category}`),
                                    
                                    h('div', {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#ccc'
                                        }
                                    },
                                        h('span', { style: { fontSize: '1.2rem' } }, discussion.author.avatar),
                                        h('span', null, discussion.author.name),
                                        h('span', null, '•'),
                                        h('span', null, formatTimeAgo(discussion.lastReply))
                                    )
                                )
                            ),
                            
                            h('div', {
                                style: {
                                    textAlign: 'right',
                                    color: '#ccc'
                                }
                            },
                                h('div', {
                                    style: { marginBottom: '0.5rem' }
                                }, `💬 ${discussion.replies} replies`),
                                h('button', {
                                    onClick: () => likeDiscussion(discussion.id),
                                    style: {
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--cannabis-green)',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }
                                }, `💚 ${discussion.likes}`)
                            )
                        ),
                        
                        h('p', {
                            style: {
                                color: '#ddd',
                                lineHeight: '1.5',
                                margin: 0
                            }
                        }, discussion.content)
                    )
                )
            )
        ),

        // Polls Tab
        activeTab === 'polls' && h('div', null,
            // New Poll Form
            h('div', {
                style: {
                    background: 'var(--cannabis-bg-medium)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    marginBottom: '2rem',
                    border: '2px solid var(--cannabis-purple)'
                }
            },
                h('h3', {
                    style: {
                        color: 'var(--cannabis-purple)',
                        marginBottom: '1rem'
                    }
                }, '📊 Create a Poll'),
                
                h('div', {
                    style: { marginBottom: '1rem' }
                },
                    h('input', {
                        type: 'text',
                        placeholder: 'Poll question...',
                        value: newPoll.question,
                        onChange: (e) => setNewPoll({ ...newPoll, question: e.target.value }),
                        style: {
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '2px solid var(--cannabis-purple)',
                            background: 'var(--cannabis-bg-dark)',
                            color: 'white',
                            fontSize: '1rem'
                        }
                    })
                ),
                
                newPoll.options.map((option, index) =>
                    h('div', {
                        key: index,
                        style: { 
                            marginBottom: '0.5rem',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }
                    },
                        h('input', {
                            type: 'text',
                            placeholder: `Option ${index + 1}...`,
                            value: option,
                            onChange: (e) => {
                                const newOptions = [...newPoll.options];
                                newOptions[index] = e.target.value;
                                setNewPoll({ ...newPoll, options: newOptions });
                            },
                            style: {
                                flex: 1,
                                padding: '0.6rem',
                                borderRadius: '8px',
                                border: '2px solid var(--cannabis-purple)',
                                background: 'var(--cannabis-bg-dark)',
                                color: 'white'
                            }
                        }),
                        index > 1 && h('button', {
                            onClick: () => {
                                const newOptions = newPoll.options.filter((_, i) => i !== index);
                                setNewPoll({ ...newPoll, options: newOptions });
                            },
                            style: {
                                background: '#f44336',
                                border: 'none',
                                color: 'white',
                                padding: '0.6rem',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }
                        }, '❌')
                    )
                ),
                
                h('div', {
                    style: {
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1rem'
                    }
                },
                    h('button', {
                        onClick: () => setNewPoll({ 
                            ...newPoll, 
                            options: [...newPoll.options, ''] 
                        }),
                        style: {
                            background: 'var(--cannabis-green)',
                            border: 'none',
                            color: 'white',
                            padding: '0.6rem 1rem',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }
                    }, '➕ Add Option'),
                    
                    h('button', {
                        onClick: addPoll,
                        className: 'cannabis-btn',
                        style: {
                            background: 'linear-gradient(45deg, var(--cannabis-purple), #673ab7)',
                            border: '2px solid var(--cannabis-gold)'
                        }
                    }, '📊 Create Poll')
                )
            ),

            // Polls List
            h('div', {
                style: { display: 'grid', gap: '1.5rem' }
            },
                polls.map(poll =>
                    h('div', {
                        key: poll.id,
                        style: {
                            background: 'var(--cannabis-bg-medium)',
                            padding: '1.5rem',
                            borderRadius: '15px',
                            border: '2px solid var(--cannabis-purple)'
                        }
                    },
                        h('div', {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }
                        },
                            h('span', { style: { fontSize: '1.5rem' } }, poll.author.avatar),
                            h('div', { style: { flex: 1 } },
                                h('h4', {
                                    style: {
                                        color: 'white',
                                        margin: '0 0 0.3rem 0'
                                    }
                                }, poll.question),
                                h('div', {
                                    style: { color: '#ccc', fontSize: '0.9rem' }
                                }, `by ${poll.author.name} • ${poll.totalVotes} votes`)
                            )
                        ),
                        
                        h('div', {
                            style: { display: 'grid', gap: '0.8rem' }
                        },
                            poll.options.map((option, index) => {
                                const percentage = poll.totalVotes > 0 
                                    ? Math.round((option.votes / poll.totalVotes) * 100) 
                                    : 0;
                                
                                return h('button', {
                                    key: index,
                                    onClick: () => votePoll(poll.id, index),
                                    style: {
                                        background: 'var(--cannabis-bg-dark)',
                                        border: '2px solid var(--cannabis-purple)',
                                        borderRadius: '10px',
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        textAlign: 'left',
                                        transition: 'all 0.3s ease'
                                    }
                                },
                                    h('div', {
                                        style: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            width: `${percentage}%`,
                                            background: 'linear-gradient(45deg, var(--cannabis-purple), #673ab7)',
                                            opacity: 0.3,
                                            transition: 'width 0.5s ease'
                                        }
                                    }),
                                    h('div', {
                                        style: {
                                            position: 'relative',
                                            zIndex: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }
                                    },
                                        h('span', {
                                            style: { color: 'white', fontWeight: 'bold' }
                                        }, option.text),
                                        h('span', {
                                            style: { color: 'var(--cannabis-purple)', fontWeight: 'bold' }
                                        }, `${percentage}% (${option.votes})`)
                                    )
                                );
                            })
                        ),
                        
                        h('div', {
                            style: {
                                textAlign: 'center',
                                marginTop: '1rem',
                                color: '#888',
                                fontSize: '0.8rem'
                            }
                        }, `Poll ends ${formatTimeAgo(poll.endsAt)}`)
                    )
                )
            )
        ),

        // Q&A Tab
        activeTab === 'qa' && h('div', {
            style: {
                background: 'var(--cannabis-bg-medium)',
                padding: '2rem',
                borderRadius: '15px',
                border: '2px solid var(--cannabis-gold)',
                textAlign: 'center'
            }
        },
            h('h3', {
                style: {
                    color: 'var(--cannabis-gold)',
                    marginBottom: '1rem'
                }
            }, '❓ Event Planning Q&A'),
            
            h('div', {
                style: {
                    background: 'var(--cannabis-bg-dark)',
                    padding: '2rem',
                    borderRadius: '10px',
                    marginBottom: '2rem'
                }
            },
                h('h4', {
                    style: { color: 'var(--cannabis-green)', marginBottom: '1rem' }
                }, '🌿 Frequently Asked Questions'),
                
                h('div', {
                    style: { textAlign: 'left', color: '#ddd' }
                },
                    h('p', { style: { marginBottom: '1rem' } },
                        h('strong', { style: { color: 'var(--cannabis-green)' } }, 'Q: How do I organize a cannabis-friendly event?'),
                        h('br'),
                        'A: Check local laws, get proper permits, choose cannabis-friendly venues, and ensure good ventilation.'
                    ),
                    h('p', { style: { marginBottom: '1rem' } },
                        h('strong', { style: { color: 'var(--cannabis-green)' } }, 'Q: What should I bring to a 420 event?'),
                        h('br'),
                        'A: Bring your own cannabis (if legal), water, snacks, and a positive attitude! Some events provide consumption options.'
                    ),
                    h('p', { style: { marginBottom: '1rem' } },
                        h('strong', { style: { color: 'var(--cannabis-green)' } }, 'Q: Are there age restrictions?'),
                        h('br'),
                        'A: Yes, all cannabis events are 21+ (or 18+ in medical states). Valid ID required.'
                    )
                )
            ),
            
            h('p', {
                style: { color: '#ccc', marginBottom: '1rem' }
            }, 'Have a question about event planning? Ask the community!'),
            
            h('button', {
                className: 'cannabis-btn',
                style: {
                    background: 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))',
                    border: '2px solid var(--cannabis-green)'
                }
            }, '🌱 Ask a Question')
        )
    );
}

// Make CommunityBoard available globally
window.CommunityBoard = CommunityBoard;