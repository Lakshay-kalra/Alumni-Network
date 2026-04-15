import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiUrl } from '../proxy';

const CreateAnnouncement = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    imageUrl: '',
    isImportant: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      alert("Please fill in the required fields: Title and Description.");
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(apiUrl('/api/announcements'), formData, config);
      alert('Announcement created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating announcement', error);
      alert('Failed to post announcement. Please try again.');
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
        <Link to="/dashboard" className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 mt-1" style={{ width: '40px', height: '40px' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="mb-0 fw-bold text-white">Create New Announcement</h2>
          <p className="text-white">Broadcast important news and updates to the campus community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <CardSection title="Announcement Details">
          <div className="mb-3">
            <label className="form-label text-white small fw-bold">Announcement Title <span className="text-danger">*</span></label>
            <input 
              type="text" 
              name="title" 
              className="form-control bg-dark text-white border-secondary" 
              placeholder="e.g. Campus Hackathon starts tomorrow!" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label text-white small fw-bold">Description <span className="text-danger">*</span></label>
            <textarea 
              name="message" 
              className="form-control bg-dark text-white border-secondary" 
              rows="6" 
              placeholder="Enter the full description of the announcement..." 
              value={formData.message} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>
          
          <div className="mb-0">
            <label className="form-label text-white small fw-bold">Banner Image URL (Optional)</label>
            <input 
              type="text" 
              name="imageUrl" 
              className="form-control bg-dark text-white border-secondary" 
              placeholder="e.g. https://images.unsplash.com/..." 
              value={formData.imageUrl} 
              onChange={handleChange} 
            />
            {formData.imageUrl && (
              <div className="mt-3">
                <p className="text-white small mb-2">Image Preview:</p>
                <img src={formData.imageUrl} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '200px' }} />
              </div>
            )}
          </div>
        </CardSection>

        <CardSection title="Display Settings">
           <div className="d-flex align-items-center justify-content-between mb-2">
            <div>
              <h6 className="mb-0 text-white">Mark as Important</h6>
              <small className="text-white">Important announcements will be permanently pushed to the top of the timeline</small>
            </div>
            <div className="form-check form-switch fs-4">
              <input className="form-check-input" type="checkbox" name="isImportant" checked={formData.isImportant} onChange={handleChange} />
            </div>
          </div>
        </CardSection>

        <div className="d-flex justify-content-end gap-3 mt-4 mb-5 pb-5">
           <Link to="/dashboard" className="btn btn-outline-secondary px-4">Cancel</Link>
           <button type="submit" className="btn btn-danger px-4" disabled={loading}>
             {loading ? 'Posting...' : 'Post Announcement'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
