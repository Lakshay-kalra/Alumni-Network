import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, Users, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../proxy';

const Events = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(apiUrl('/api/events'), config);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async (event) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(apiUrl(`/api/events/${event._id}/join`), {}, config);
      alert(`Successfully RSVP'd for ${event.title}! A notification has been sent to your Messages.`);
      fetchEvents(); // Refresh
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container py-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="mb-1 d-flex align-items-center gap-2 text-warning"><Calendar size={28} /> Campus Events</h2>
          <p className="text-muted">Discover and join upcoming college events, workshops, and meetups</p>
        </div>
        {(user.role === 'admin' || user.role === 'alumni') && (
          <Link to="/events/create" className="btn btn-warning text-white fw-bold d-flex align-items-center gap-2 shadow-sm hover-lift text-decoration-none">
            <PlusCircle size={18} /> Host Event
          </Link>
        )}
      </div>

      <div className="row g-4">
        {events.length === 0 ? (
          <div className="col-12 text-center text-muted p-5 feed-card">
            No events scheduled right now. Check back later!
          </div>
        ) : (
          events.map((evt) => (
            <div key={evt._id} className="col-md-6 col-lg-4">
              <div className="feed-card d-flex flex-column h-100 overflow-hidden" style={{ borderTop: '4px solid #f59e0b' }}>
                {evt.imageUrl && (
                  <img src={evt.imageUrl} alt="Event" className="img-fluid w-100 object-fit-cover" style={{ height: '180px' }} />
                )}
                <div className="p-4 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-warning text-dark text-uppercase small">{new Date(evt.date).toLocaleDateString()}</span>
                  </div>
                  <h5 className="fw-bold text-light mb-2">{evt.title}</h5>
                  <p className="text-white small mb-3 text-truncate-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {evt.description}
                  </p>
                  
                  <div className="d-flex align-items-center text-white small mb-2 gap-2">
                    <Clock size={16} className="text-primary"/> 
                    {new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="d-flex align-items-center text-white small gap-2 mb-3">
                    <MapPin size={16} className="text-danger"/> {evt.location}
                  </div>
                  
                  <div className="d-flex align-items-center gap-2 mt-auto">
                    <div className="d-flex align-items-center text-white small me-auto">
                      <Users size={16} className="me-1 text-success"/> 
                      {evt.attendees?.length || 0} attending
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-dark border-top border-secondary mt-auto text-center">
                  {evt.attendees?.includes(user._id) ? (
                    <button className="btn btn-outline-success w-100 disabled text-success border-success" disabled>
                      ✓ Already Joined
                    </button>
                  ) : (
                    <button onClick={() => joinEvent(evt)} className="btn btn-primary-gradient w-100 fw-bold">
                      RSVP Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
