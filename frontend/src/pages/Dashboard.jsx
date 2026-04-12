import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Megaphone, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const [annRes, eventRes] = await Promise.all([
          axios.get('http://localhost:5000/api/announcements', config),
          axios.get('http://localhost:5000/api/events', config)
        ]);
        setAnnouncements(annRes.data.slice(0, 5)); // First 5
        setEvents(eventRes.data.slice(0, 3)); // Top 3
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container py-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="mb-1">Welcome back, <span className="text-primary">{user.name.split(' ')[0]}</span> 👋</h2>
          <p className="text-muted">Stay connected with your college community</p>
        </div>
        {user.role === 'admin' && (
          <Link to="/announcements/create" className="btn btn-danger d-flex align-items-center gap-2 text-white text-decoration-none">
            <Megaphone size={16} /> New Announcement
          </Link>
        )}
      </div>

      <div className="row g-4">
        {/* Left Column: Announcements */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="d-flex align-items-center gap-2 m-0"><Megaphone className="text-danger" size={24} /> Official Announcements</h4>
          </div>
          
          {announcements.length === 0 ? (
            <div className="feed-card p-4 text-center text-muted">No recent announcements.</div>
          ) : (
            announcements.map((ann, idx) => (
              <div key={idx} className="feed-card p-4">
                {ann.imageUrl && (
                  <img src={ann.imageUrl} alt="Announcement" className="img-fluid rounded mb-3 w-100 object-fit-cover" style={{ height: '250px' }} />
                )}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="mb-0 text-light">{ann.title}</h5>
                  {ann.isImportant && <span className="announcement-badge">Important</span>}
                </div>
                <p className="text-muted small mb-3">Posted by {ann.author?.name || 'Admin'} • {new Date(ann.createdAt).toLocaleDateString()}</p>
                <p className="mb-0 text-white">{ann.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Events & Quick Links */}
        <div className="col-lg-4">
          <div className="feed-card p-4 mb-4" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)' }}>
            <h5 className="mb-3 d-flex align-items-center gap-2 text-primary"><Users size={20} /> Your Network</h5>
            <p className="text-muted small mb-3">Discover alumni from your branch or connect with current students to expand your horizons.</p>
            <Link to="/directory" className="btn btn-outline-primary w-100 d-flex justify-content-between align-items-center">
              Browse Directory <ArrowRight size={16} />
            </Link>
          </div>

          <div className="d-flex align-items-center justify-content-between mb-3 mt-4">
            <h5 className="d-flex align-items-center gap-2 m-0"><Calendar className="text-warning" size={20} /> Upcoming Events</h5>
            <Link to="/events" className="text-muted text-decoration-none small">View all</Link>
          </div>
          
          {events.length === 0 ? (
            <div className="feed-card p-4 text-center text-muted">No upcoming events.</div>
          ) : (
            events.map((evt, idx) => (
              <div key={idx} className="feed-card p-3 mb-3 border-start border-4 border-warning">
                {evt.imageUrl && (
                  <img src={evt.imageUrl} alt="Event" className="img-fluid rounded mb-2 w-100 object-fit-cover" style={{ height: '120px' }} />
                )}
                <h6 className="mb-1 text-light">{evt.title}</h6>
                <p className="text-muted small mb-2">{new Date(evt.date).toLocaleDateString()} at {evt.location}</p>
                <Link to="/events" className="text-primary text-decoration-none small fw-semibold">Learn more</Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
