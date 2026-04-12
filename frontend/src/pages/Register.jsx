import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    branch: '',
    graduationYear: '',
    contactNumber: '',
    linkedinProfile: '',
    designation: '',
    organisation: '',
    personalMatchingInfo: '',
    shortBio: '',
    areaOfExpertise: ''
  });
  
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container py-5">
      <div className="glass-card fade-in" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-4">
          <h2 className="gradient-text fs-2 mb-2">Join AluminiConnect</h2>
          <p className="text-muted">Create your account to start networking</p>
        </div>

        {error && <div className="alert alert-danger p-2 text-center">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="row g-3">
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label text-light">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label text-light">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input 
              type="password" 
              className="form-control" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-4 mb-3">
              <label className="form-label text-light">Role</label>
              <select 
                className="form-select bg-dark text-light border-secondary" 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <label className="form-label text-light">Branch</label>
              <input 
                type="text" 
                className="form-control" 
                name="branch" 
                placeholder="e.g. CS" 
                value={formData.branch} 
                onChange={handleChange} 
              />
            </div>
            <div className="col-12 col-md-4 mb-3">
              <label className="form-label text-light">
                {formData.role === 'student' ? 'Current Year of Studying' : 'Graduation Year'}
              </label>
              <input 
                type="number" 
                className="form-control" 
                name="graduationYear" 
                placeholder="YYYY" 
                value={formData.graduationYear} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {formData.role === 'alumni' && (
            <>
              <div className="row g-3">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label text-light">Contact Number</label>
                  <input type="text" className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label text-light">LinkedIn Profile</label>
                  <input type="text" className="form-control" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label text-light">Designation</label>
                  <input type="text" className="form-control" name="designation" value={formData.designation} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label text-light">Organisation</label>
                  <input type="text" className="form-control" name="organisation" value={formData.organisation} onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-light">Area of Expertise</label>
                <input type="text" className="form-control" name="areaOfExpertise" value={formData.areaOfExpertise} onChange={handleChange} placeholder="e.g. Machine Learning, Web Development" />
              </div>
              <div className="mb-3">
                <label className="form-label text-light">Personal + Matching Info</label>
                <textarea className="form-control" name="personalMatchingInfo" value={formData.personalMatchingInfo} onChange={handleChange} rows="2" placeholder="Tell us about yourself and what you're looking for..."></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label text-light">Short Bio</label>
                <textarea className="form-control" name="shortBio" value={formData.shortBio} onChange={handleChange} rows="2"></textarea>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary-gradient w-100 text-white mt-3">
            Create Account
          </button>
        </form>

        <div className="text-center mt-4 text-muted">
          Already have an account? <Link to="/login" className="text-primary text-decoration-none ms-1">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
