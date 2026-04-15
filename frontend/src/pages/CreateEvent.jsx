import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Plus, X } from 'lucide-react';
import { apiUrl } from '../proxy';

const CreateEvent = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    club: '',
    title: '',
    eventType: '',
    status: 'Published',
    description: '',
    imageUrl: '', // for banner
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    locationType: 'In-Person',
    location: '', // room / link
    building: '',
    fullAddress: '',
    isPaid: false,
    isPublic: true,
    participationType: 'Individual',
    maxCapacity: '',
    itinerary: [],
    gallery: [],
    contactPersons: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleItineraryAdd = () => {
    setFormData(prev => ({ ...prev, itinerary: [...prev.itinerary, { time: '', activity: '' }] }));
  };

  const handleItineraryChange = (idx, field, value) => {
    const newItin = [...formData.itinerary];
    newItin[idx][field] = value;
    setFormData(prev => ({ ...prev, itinerary: newItin }));
  };

  const handleItineraryRemove = (idx) => {
    const newItin = [...formData.itinerary];
    newItin.splice(idx, 1);
    setFormData(prev => ({ ...prev, itinerary: newItin }));
  };

  const handleContactAdd = () => {
    setFormData(prev => ({ ...prev, contactPersons: [...prev.contactPersons, { name: '', email: '', phone: '' }] }));
  };

  const handleContactChange = (idx, field, value) => {
    const newContacts = [...formData.contactPersons];
    newContacts[idx][field] = value;
    setFormData(prev => ({ ...prev, contactPersons: newContacts }));
  };

  const handleContactRemove = (idx) => {
    const newContacts = [...formData.contactPersons];
    newContacts.splice(idx, 1);
    setFormData(prev => ({ ...prev, contactPersons: newContacts }));
  };

  // Simple string input for imageUrl to act as upload
  const handleBannerUpload = () => {
    const url = prompt("Enter banner image URL (e.g., https://unsplash.com/...):", formData.imageUrl);
    if(url !== null) setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.startDate || !formData.location) {
      alert("Please fill in the required fields: Title, Description, Start Date, and Location.");
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(apiUrl('/api/events'), formData, config);
      alert('Event created successfully!');
      navigate('/events');
    } catch (error) {
      console.error('Error creating event', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CardSection = ({ title, sub, children }) => (
    <div className="feed-card p-4 mb-4">
      <h6 className="fw-bold mb-1 letter-spacing text-uppercase text-white">{title}</h6>
      {sub && <p className="text-white small mb-3">{sub}</p>}
      <hr className="border-secondary mt-2 mb-4"/>
      {children}
    </div>
  );

  return (
    <div className="container py-4 fade-in" style={{ maxWidth: '800px' }}>
      <div className="d-flex align-items-start mb-4 gap-3">
        <Link to="/events" className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 mt-1" style={{ width: '40px', height: '40px' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="mb-0 fw-bold">Create New Event</h2>
          <p className="text-white">Fill in the details and choose the event status</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        


        <CardSection title="Event Details">
          <div className="mb-3">
            <label className="form-label text-white small fw-bold">Event Title <span className="text-danger">*</span></label>
            <input type="text" name="title" className="form-control bg-dark text-white border-secondary" placeholder="e.g. Annual Hackathon 2026" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label text-white small fw-bold">Event Type <span className="text-danger">*</span></label>
              <select name="eventType" className="form-select bg-dark text-white border-secondary" value={formData.eventType} onChange={handleChange}>
                <option value="">Select type...</option>
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Seminar">Seminar</option>
                <option value="Meetup">Meetup</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label text-white small fw-bold">Status</label>
              <select name="status" className="form-select bg-dark text-white border-secondary" value={formData.status} onChange={handleChange}>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="mb-0">
            <label className="form-label text-white small fw-bold">Description <span className="text-danger">*</span></label>
            <textarea name="description" className="form-control bg-dark text-white border-secondary" rows="4" placeholder="Describe what attendees can expect..." value={formData.description} onChange={handleChange} required></textarea>
          </div>
        </CardSection>

        <CardSection title="Banner Image">
          <div 
            className="border border-secondary border-dashed rounded p-5 text-center hover-bg-light" 
            style={{ cursor: 'pointer', borderStyle: 'dashed', borderWidth: '2px' }}
            onClick={handleBannerUpload}
          >
            {formData.imageUrl ? (
               <img src={formData.imageUrl} alt="Banner Preview" className="img-fluid rounded" style={{ maxHeight: '200px' }} />
            ) : (
               <>
                 <div className="btn btn-dark rounded-circle p-3 mb-3 d-inline-flex shadow"><UploadCloud size={30} /></div>
                 <h6 className="text-white">Click to enter image URL</h6>
                 <p className="text-white small mb-0">1200x500px recommended</p>
                 <p className="text-white small" style={{ fontSize: '11px' }}>JPEG, PNG, WebP, GIF | Max 100 MB</p>
               </>
            )}
          </div>
        </CardSection>

        <CardSection title="Date & Time">
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label text-white small fw-bold">Start Date & Time <span className="text-danger">*</span></label>
              <input type="datetime-local" name="startDate" className="form-control bg-dark text-white border-secondary" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label text-white small fw-bold">End Date & Time</label>
              <input type="datetime-local" name="endDate" className="form-control bg-dark text-white border-secondary" value={formData.endDate} onChange={handleChange} />
            </div>
          </div>
          <div className="mb-0">
            <label className="form-label text-white small fw-bold">Registration Deadline</label>
            <input type="datetime-local" name="registrationDeadline" className="form-control bg-dark text-white border-secondary" value={formData.registrationDeadline} onChange={handleChange} />
            <div className="form-text text-white small">Leave blank for no deadline</div>
          </div>
        </CardSection>

        <CardSection title="Location" sub="Choose between an in-person venue or an online event">
          <div className="d-flex gap-3 mb-4">
            <div 
              className={`flex-grow-1 p-3 rounded text-center border ${formData.locationType === 'In-Person' ? 'border-danger bg-danger bg-opacity-10 text-danger' : 'border-secondary text-white'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setFormData({...formData, locationType: 'In-Person'})}
            >
              <h6 className="mb-1 fw-bold"><i className="bi bi-geo-alt me-2"></i>In-Person</h6>
              <small>Physical venue</small>
            </div>
            <div 
              className={`flex-grow-1 p-3 rounded text-center border ${formData.locationType === 'Online' ? 'border-primary bg-primary bg-opacity-10 text-primary' : 'border-secondary text-white'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setFormData({...formData, locationType: 'Online'})}
            >
              <h6 className="mb-1 fw-bold"><i className="bi bi-camera-video me-2"></i>Online</h6>
              <small>Virtual meeting</small>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-white small fw-bold">{formData.locationType === 'In-Person' ? 'Location / Room' : 'Meeting Link'} <span className="text-danger">*</span></label>
            <input type="text" name="location" className="form-control bg-dark text-white border-secondary" placeholder={formData.locationType === 'In-Person' ? 'e.g. Room 201, Innovation Block' : 'e.g. https://meet.google.com/...'} value={formData.location} onChange={handleChange} required />
          </div>

          {formData.locationType === 'In-Person' && (
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-white small fw-bold">Building / Block</label>
                <input type="text" name="building" className="form-control bg-dark text-white border-secondary" placeholder="e.g. A Block, Innovation Hub" value={formData.building} onChange={handleChange} />
                <div className="form-text text-white small">Optional</div>
              </div>
              <div className="col-md-6">
                <label className="form-label text-white small fw-bold">Full Address</label>
                <input type="text" name="fullAddress" className="form-control bg-dark text-white border-secondary" placeholder="e.g. Chitkara University, Rajpura" value={formData.fullAddress} onChange={handleChange} />
                <div className="form-text text-white small">Optional</div>
              </div>
            </div>
          )}
        </CardSection>

        <CardSection title="Registration Settings">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
            <div>
              <h6 className="mb-0 text-white">Paid Event</h6>
              <small className="text-white">Participants will be shown the registration fee before signing up</small>
            </div>
            <div className="form-check form-switch fs-4">
              <input className="form-check-input" type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
            </div>
          </div>
          
          <div className="d-flex align-items-center justify-content-between mb-4 mt-3">
            <div>
              <h6 className="mb-0 text-white">Public Event</h6>
              <small className="text-white">Show this event on the public site. Uncheck to keep it internal.</small>
            </div>
            <div className="form-check form-switch fs-4">
              <input className="form-check-input" type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-white small fw-bold">Participation Type</label>
            <div className="d-flex gap-3">
              {['Individual', 'Team', 'Both'].map(type => (
                 <div 
                    key={type}
                    className={`flex-grow-1 p-3 text-center border rounded ${formData.participationType === type ? 'border-danger text-danger bg-danger bg-opacity-10' : 'border-secondary text-white'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFormData({...formData, participationType: type})}
                 >
                   <h6 className="mb-0">{type}</h6>
                 </div>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label text-white small fw-bold">Maximum Capacity</label>
            <input type="number" name="maxCapacity" className="form-control bg-dark text-white border-secondary" min="1" value={formData.maxCapacity} onChange={handleChange} />
            <div className="form-text text-white small">Leave blank for unlimited capacity</div>
          </div>
        </CardSection>

        <CardSection title="Event Itinerary" sub="Build a schedule/timeline shown on the event page">
           {formData.itinerary.map((item, idx) => (
             <div key={idx} className="d-flex gap-2 mb-3 bg-dark border border-secondary p-2 rounded">
                 <input type="time" className="form-control bg-transparent text-white border-0 w-25" placeholder="Time" value={item.time} onChange={e => handleItineraryChange(idx, 'time', e.target.value)} />
                 <input type="text" className="form-control bg-transparent text-white border-0 w-75" placeholder="Activity details..." value={item.activity} onChange={e => handleItineraryChange(idx, 'activity', e.target.value)} />
                 <button type="button" className="btn btn-outline-danger border-0 p-2" onClick={() => handleItineraryRemove(idx)}><X size={18}/></button>
             </div>
           ))}
           <button type="button" className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleItineraryAdd}>
              <Plus size={16} /> Add Itinerary Item
           </button>
        </CardSection>

        <CardSection title="Event Gallery" sub="Upload photos for the event gallery (up to 8 images). Drag to reorder.">
          <div 
            className="border border-secondary border-dashed rounded p-5 text-center hover-bg-light" 
            style={{ cursor: 'pointer', borderStyle: 'dashed', borderWidth: '2px' }}
            onClick={() => {
              const url = prompt("Enter gallery image URL:");
              if(url) setFormData(prev => ({...prev, gallery: [...prev.gallery, url]}));
            }}
          >
             <div className="btn btn-dark rounded-circle p-3 mb-3 d-inline-flex shadow"><UploadCloud size={30} /></div>
             <h6 className="text-white">Click to add gallery image URL</h6>
             <p className="text-white small">JPG, PNG, WEBP - up to 8 photos</p>
          </div>
          {formData.gallery.length > 0 && (
            <div className="mt-3 d-flex flex-wrap gap-2">
               {formData.gallery.map((url, idx) => (
                 <div key={idx} className="position-relative">
                   <img src={url} alt="Gallery" className="rounded" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                   <button type="button" className="btn btn-danger btn-sm p-0 position-absolute top-0 end-0 rounded-circle" style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }} onClick={() => {
                     const newGal = [...formData.gallery]; newGal.splice(idx,1); setFormData({...formData, gallery: newGal});
                   }}><X size={12}/></button>
                 </div>
               ))}
            </div>
          )}
        </CardSection>

        <CardSection title="Contact Persons" sub="Add organiser contacts displayed on the event page">
           {formData.contactPersons.map((person, idx) => (
             <div key={idx} className="p-3 bg-dark border border-secondary rounded mb-3 position-relative">
               <button type="button" className="btn btn-outline-danger border-0 p-1 position-absolute top-0 end-0 mt-2 me-2" onClick={() => handleContactRemove(idx)}><X size={16}/></button>
               <div className="row g-2">
                 <div className="col-md-4">
                   <input type="text" className="form-control bg-transparent text-white border-secondary" placeholder="Name" value={person.name} onChange={e => handleContactChange(idx, 'name', e.target.value)} />
                 </div>
                 <div className="col-md-4">
                   <input type="email" className="form-control bg-transparent text-white border-secondary" placeholder="Email" value={person.email} onChange={e => handleContactChange(idx, 'email', e.target.value)} />
                 </div>
                 <div className="col-md-4">
                   <input type="text" className="form-control bg-transparent text-white border-secondary" placeholder="Phone" value={person.phone} onChange={e => handleContactChange(idx, 'phone', e.target.value)} />
                 </div>
               </div>
             </div>
           ))}
           <button type="button" className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleContactAdd}>
              <Plus size={16} /> Add Contact Person
           </button>
        </CardSection>

        <div className="d-flex justify-content-end gap-3 mt-4 mb-5 pb-5">
           <Link to="/events" className="btn btn-outline-secondary px-4">Cancel</Link>
           <button type="submit" className="btn btn-danger px-4" disabled={loading}>
             {loading ? 'Creating...' : 'Create Event'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
