import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ArrowRight, CheckCircle2, ChevronDown, Calendar, Users, Activity, Globe } from 'lucide-react';
import './Home.css';

const Home = () => {
  const events = [
    {
      id: 1,
      date: { month: 'APR', day: '02' },
      category: 'Workshop',
      society: 'COMPUTER SCIENCE SOCIETY',
      title: 'test',
      datetime: 'Thu, Apr 2, 2026 · 08:55 AM',
      location: 'test',
      registered: 0,
      left: 2,
      imageUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=2942'
    },
    {
      id: 2,
      date: { month: 'APR', day: '14' },
      category: 'Competition',
      society: 'ACADEMIC DEBATE SOCIETY',
      title: 'National University Debate Championship',
      datetime: 'Tue, Apr 14, 2026 · 09:00 AM',
      location: 'Main Lecture Theatre',
      registered: 1,
      left: 149,
      imageUrl: 'https://images.unsplash.com/photo-1475721025501-c1f0b0933ba1?auto=format&fit=crop&q=80&w=2940'
    },
    {
      id: 3,
      date: { month: 'APR', day: '16' },
      category: 'Competition',
      society: 'COMPUTER SCIENCE SOCIETY',
      title: 'UniHack 2026 — 24-Hour Hackathon',
      datetime: 'Thu, Apr 16, 2026 · 06:00 PM',
      location: 'CS Building — All Labs',
      registered: 1,
      left: 99,
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2940'
    },
    {
      id: 4,
      date: { month: 'APR', day: '17' },
      category: 'Sports',
      society: 'FOOTBALL (SOCCER) CLUB',
      title: 'University Soccer League — Season Opener',
      datetime: 'Fri, Apr 17, 2026 · 02:00 PM',
      location: 'University Playing Fields',
      registered: 0,
      left: 300,
      imageUrl: 'https://images.unsplash.com/photo-1518605363364-77e87b7a66e4?auto=format&fit=crop&q=80&w=2940'
    }
  ];

  const col1 = [
    {
      id: 1,
      name: 'Sarah Al-Rashidi',
      role: 'CS Society — President',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      quote: 'Joining the CS Society in my first year completely transformed my university experience. I went from a shy fresher to leading a club of 200+ members.'
    },
    {
      id: 2,
      name: 'James Okonkwo',
      role: 'Basketball Club — Captain',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      quote: 'The basketball club gave me discipline, teamwork, and some of my closest friends. We won the inter-university championship — a moment I will never forget.'
    },
    {
      id: 3,
      name: 'Priya Nair',
      role: 'Debate Society — President',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      quote: 'Debate club made me a better communicator and critical thinker. I\'ve competed at national level and the confidence it built has carried into every area of my life.'
    }
  ];

  const col2 = [
    {
      id: 4,
      name: 'Omar Raza',
      role: 'Photography Club — Member',
      image: 'https://randomuser.me/api/portraits/men/46.jpg',
      quote: 'The Office of Student Life made it incredibly easy to register for events and find clubs that match my interests. The platform is intuitive and the events are fantastic.'
    },
    {
      id: 5,
      name: 'Zainab Hussain',
      role: 'Drama Society — Lead Actress',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
      quote: 'Being part of the Drama Society helped me overcome stage fright. Now I perform in front of hundreds of students — something I never thought possible.'
    },
    {
      id: 6,
      name: 'Aliza Khan',
      role: 'Entrepreneurship Club — Founder',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
      quote: 'Running the Entrepreneurship Club connected me with mentors and fellow founders. We launched a startup together that\'s now generating real revenue.'
    }
  ];

  const col3 = [
    {
      id: 7,
      name: 'Hassan Ali',
      role: 'Robotics Club — Team Lead',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      quote: 'I joined the Robotics Club knowing almost nothing. A year later I co-led our team to second place in a national competition. The mentorship here is unmatched.'
    },
    {
      id: 8,
      name: 'Farhan Siddiqui',
      role: 'Community Outreach — Coordinator',
      image: 'https://randomuser.me/api/portraits/men/11.jpg',
      quote: 'The volunteering opportunities through Student Life have been incredibly rewarding. It\'s amazing how much impact a small group of students can have on the local community.'
    },
    {
      id: 9,
      name: 'Sana Sheikh',
      role: 'Music Society — Lead Vocalist',
      image: 'https://randomuser.me/api/portraits/women/24.jpg',
      quote: 'The Music Society gave me a stage when I had none. From open mic nights to the annual concert — these experiences shaped who I am as an artist.'
    }
  ];

  const faqs = [
    'How do I register for an event?',
    'Do I need an account to register for events?',
    'How do I find clubs on campus?',
    'Can I register for more than one event?',
    'How do I contact a club?',
    'Who do I contact for registration problems?'
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">CHITKARA</span>
            <span className="logo-subtext">UNIVERSITY</span>
            <div className="logo-icon">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rss"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
            </div>
          </div>
          <div className="nav-links">
            <a href="#" className="active">Home</a>
            <a href="#">Clubs</a>
            <a href="#">Events</a>
          </div>
          <Link to="/login" className="login-btn">
            <LogIn size={18} /> Login
          </Link>
        </div>
      </nav>

      {/* Stats Banner */}
      <div className="stats-banner">
        <div className="stat-item">
          <Activity size={32} />
          <h2>50+</h2>
          <p>ACTIVE CLUBS</p>
        </div>
        <div className="stat-item">
          <Calendar size={32} />
          <h2>200+</h2>
          <p>EVENTS PER YEAR</p>
        </div>
        <div className="stat-item">
          <Users size={32} />
          <h2>5,000+</h2>
          <p>STUDENT MEMBERS</p>
        </div>
        <div className="stat-item">
          <Globe size={32} />
          <h2>12+</h2>
          <p>CLUB CATEGORIES</p>
        </div>
      </div>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="section-tag">— ABOUT US</div>
          <h1 className="section-title">Office of Student Life</h1>
          <p className="about-lead">
            The Office of Student Life is dedicated to enriching the university experience through vibrant clubs, exciting events, and a thriving campus community.
          </p>
          <p className="about-text">
            Our mission is to foster personal growth, leadership, and community engagement among all students.
          </p>
          <ul className="feature-list">
            <li><CheckCircle2 size={20} className="check-icon" /> Supporting 50+ registered student clubs</li>
            <li><CheckCircle2 size={20} className="check-icon" /> Hosting 200+ events every semester</li>
            <li><CheckCircle2 size={20} className="check-icon" /> Connecting students with leadership opportunities</li>
          </ul>
        </div>
        <div className="about-image-container">
          <div className="floating-badge">
            <h3>50+</h3>
            <p>Active clubs</p>
          </div>
          <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=2670" alt="Students" className="about-image" />
          <h1 className="hashtag-overlay">#Chitkara</h1>
        </div>
      </section>

      {/* Events Section */}
      <section className="events-section">
        <div className="events-header">
          <div>
            <div className="section-tag">— WHAT'S ON</div>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Register now — spots fill fast</p>
          </div>
          <button className="all-events-btn">
            All Events <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image-wrapper">
                <img src={event.imageUrl} alt={event.title} />
                <div className="date-badge">
                  <span className="month">{event.date.month}</span>
                  <span className="day">{event.date.day}</span>
                </div>
                <div className="category-badge">{event.category}</div>
              </div>
              <div className="event-details">
                <p className="event-society">{event.society}</p>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-meta">
                  <p><Calendar size={14} className="meta-icon" /> {event.datetime}</p>
                  <p><Activity size={14} className="meta-icon" /> {event.location}</p>
                </div>
                <div className="event-stats">
                  <span><Users size={14} className="meta-icon" /> {event.registered} registered</span>
                  <span className="spots-left">{event.left} left</span>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${(event.registered / (event.registered + event.left)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-tag centered">— STUDENT VOICES</div>
        <h2 className="section-title centered text-white">What Our Students Say</h2>
        <p className="section-subtitle centered text-gray">
          Hear from students whose university lives <br /> were transformed by getting involved in <br /> campus clubs and events.
        </p>

        <div className="testimonials-masonry">
          {[col1, col2, col3].map((column, colIndex) => (
            <div key={colIndex} className={`masonry-column ${colIndex === 1 ? 'pt-12' : ''}`}>
              <div 
                className={`masonry-column-inner ${colIndex % 2 === 0 ? 'scroll-slow' : 'scroll-fast'}`}
              >
                {[...column, ...column].map((testimonial, idx) => (
                  <div 
                    key={`${testimonial.id}-${idx}`} 
                    className="testimonial-card"
                  >
                    <p className="quote">{testimonial.quote}</p>
                    <div className="user-info mt-4">
                      <img src={testimonial.image} alt={testimonial.name} className="user-avatar" />
                      <div>
                        <h4>{testimonial.name}</h4>
                        <p>{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-tag centered">— FAQ</div>
        <h2 className="section-title centered">Frequently Asked Questions</h2>
        <p className="section-subtitle centered">
          Everything you need to know about clubs and events. <span className="text-red">Contact us</span> if you need more help.
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <span>{faq}</span>
              <ChevronDown size={20} className="faq-icon" />
            </div>
          ))}
        </div>
      </section>

      {/* Credit Badge */}
      <div className="custom-credit">
        <span className="credit-text">Made by <span className="highlight">Lakshay Kalra</span></span>
      </div>
    </div>
  );
};

export default Home;
