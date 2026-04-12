import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Award, User, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Directory = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [mentoredByMe, setMentoredByMe] = useState([]);
  
  const loggedUser = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, branchFilter]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${loggedUser.token}` }
      };
      
      let query = `?keyword=${keyword}`;
      if (roleFilter) query += `&role=${roleFilter}`;
      if (branchFilter) query += `&branch=${branchFilter}`;
      
      const { data } = await axios.get(`http://localhost:5000/api/users${query}`, config);
      setUsers(data);

      if (loggedUser.role === 'alumni') {
        const profileRes = await axios.get(`http://localhost:5000/api/users/profile/${loggedUser._id}`, config);
        setMentoredByMe((profileRes.data.mentoredStudents || []).map(s => s._id || s));
      }
    } catch (error) {
      console.error("Error fetching network directory", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMentor = async (studentId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${loggedUser.token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/users/mentor/${studentId}`, {}, config);
      setMentoredByMe(data || []);
    } catch (error) {
      console.error('Error toggling mentor status', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="container py-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 d-flex align-items-center gap-2"><User size={28} className="text-primary"/> Network Directory</h2>
          <p className="text-muted">Find students and alumni from your college</p>
        </div>
      </div>

      <div className="feed-card p-3 mb-5">
        <form onSubmit={handleSearch} className="row g-3 align-items-center">
          <div className="col-md-5 position-relative">
            <Search className="position-absolute text-muted" size={18} style={{ left: '15px', top: '12px' }}/>
            <input 
              type="text" 
              className="form-control ps-5" 
              placeholder="Search by name..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select bg-dark text-light border-secondary" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <div className="col-md-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Filter by Branch" 
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary-gradient w-100 p-2"><Search size={20}/></button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : (
        <div className="row g-4">
          {users.map(u => (
            <div key={u._id} className="col-md-6 col-lg-4">
              <div className="feed-card p-4 h-100 d-flex flex-column align-items-center text-center">
                {u.profilePicture ? (
                  <img src={u.profilePicture} alt="Profile" className="profile-img-lg mb-3" />
                ) : (
                  <div className="profile-img-lg mb-3 bg-secondary d-flex align-items-center justify-content-center text-white fs-1">
                    {u.name.charAt(0)}
                  </div>
                )}
                
                <h5 className="mb-1 fw-bold text-light">{u.name}</h5>
                <span className={`badge ${u.role === 'alumni' ? 'bg-primary' : 'bg-success'} mb-2 text-uppercase`} style={{ fontSize: '0.7em', letterSpacing: '1px' }}>
                  {u.role}
                </span>
                
                <div className="w-100 text-start mt-3">
                  <p className="text-white small mb-1 d-flex align-items-center gap-2">
                    <MapPin size={14} className="text-primary"/> {u.branch || 'Branch not specified'}
                  </p>
                  {u.graduationYear && (
                    <p className="text-white small mb-0 d-flex align-items-center gap-2">
                      <Award size={14} className="text-warning"/> Class of {u.graduationYear}
                    </p>
                  )}
                </div>
                
                <div className="mt-auto pt-4 w-100 d-flex gap-2">
                  <Link to={`/profile/${u._id}`} className="btn btn-outline-secondary w-50 small">View Profile</Link>
                  {loggedUser._id !== u._id && (
                    <Link to={`/chat?userId=${u._id}`} className="btn btn-primary-gradient w-50 small d-flex align-items-center justify-content-center gap-1">
                      <MessageCircle size={14}/> Connect
                    </Link>
                  )}
                </div>
                {loggedUser.role === 'alumni' && u.role === 'student' && (
                  <button 
                    className={`btn w-100 mt-2 small d-flex justify-content-center align-items-center ${mentoredByMe.includes(u._id) ? 'btn-outline-danger' : 'btn-outline-success'}`}
                    onClick={() => handleToggleMentor(u._id)}
                  >
                     {mentoredByMe.includes(u._id) ? 'Remove from Mentees' : '+ Add as Mentee'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {users.length === 0 && (
             <div className="col-12 text-center text-muted">No members found matching your search.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Directory;
