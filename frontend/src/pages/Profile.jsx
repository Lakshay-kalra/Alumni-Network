import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Award, MessageCircle, Edit2 } from 'lucide-react';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const Profile = ({ currentUser }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleSaveProfile = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      const payload = {
        ...editForm,
        areasOfInterest: editForm.areasOfInterest ? editForm.areasOfInterest.split(',').map(s => s.trim()).filter(x => x) : []
      };
      const { data } = await axios.put(`http://localhost:5000/api/users/profile/${id}`, payload, config);
      setProfile({ ...profile, ...data, mentoringStatus: payload.mentoringStatus, areasOfInterest: payload.areasOfInterest, bio: payload.bio });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/users/profile/${id}`, config);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (!profile) return <div className="text-center mt-5 text-white">Profile not found</div>;

  const isOwner = currentUser._id === profile._id;

  return (
    <div className="container py-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-card position-relative w-100 p-0 overflow-hidden">
            <div className="bg-primary" style={{ height: '150px', backgroundImage: 'linear-gradient(to right, rgb(59, 130, 246), rgb(147, 51, 234))' }}></div>
            
            <div className="px-5 pb-5 position-relative text-center">
              <div style={{ marginTop: '-60px' }}>
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="profile-img-lg bg-dark mx-auto d-block" />
                ) : (
                  <div className="profile-img-lg bg-secondary mx-auto d-flex align-items-center justify-content-center text-white fs-1 shadow-lg">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              <h2 className="mt-3 text-light fw-bold">{profile.name}</h2>
              <p className="text-white d-flex align-items-center justify-content-center gap-2 mb-2">
                <span className={`badge ${profile.role === 'alumni' ? 'bg-primary' : 'bg-success'} text-uppercase`}>
                  {profile.role}
                </span>
                • <MapPin size={16}/> {profile.branch || 'Branch N/A'} • <Award size={16}/> Class of {profile.graduationYear || 'N/A'}
              </p>

              {isEditing ? (
                <div className="mt-4 px-4 text-start">
                  <div className="mb-3">
                    <label className="text-light">Bio</label>
                    <textarea className="form-control" rows="3" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                  </div>
                  {profile.role === 'alumni' && (
                    <>
                      <div className="mb-3">
                        <label className="text-light">Mentoring Status</label>
                        <select className="form-select bg-dark text-light border-secondary" value={editForm.mentoringStatus} onChange={e => setEditForm({...editForm, mentoringStatus: e.target.value})}>
                          <option value="Not Mentoring">Not Mentoring</option>
                          <option value="Available to Mentor">Available to Mentor</option>
                          <option value="Currently Mentoring">Currently Mentoring</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="text-light">Areas of Interest (comma separated)</label>
                        <input type="text" className="form-control" value={editForm.areasOfInterest} onChange={e => setEditForm({...editForm, areasOfInterest: e.target.value})} placeholder="e.g. AI, Web Development" />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {profile.role === 'alumni' && (
                    <div className="mt-3">
                      <span className={`badge ${profile.mentoringStatus === 'Currently Mentoring' ? 'bg-success' : profile.mentoringStatus === 'Available to Mentor' ? 'bg-info' : 'bg-secondary'} me-2`}>
                        {profile.mentoringStatus || 'Not Mentoring'}
                      </span>
                    </div>
                  )}

                  {profile.areasOfInterest && profile.areasOfInterest.length > 0 && (
                    <div className="mt-2 text-info small text-center">
                      <strong className="text-light">Interests:</strong> {profile.areasOfInterest.join(', ')}
                    </div>
                  )}
                  
                  {currentUser.role === 'admin' && profile.role === 'alumni' && profile.mentoredStudents && profile.mentoredStudents.length > 0 && (
                    <div className="mt-3 text-start alert alert-dark border-secondary p-2 small">
                      <strong className="text-light">Mentored Students (Admin View):</strong>
                      <ul className="mb-0 mt-1 text-muted">
                        {profile.mentoredStudents.map(student => (
                          <li key={student._id}>{student.name} ({student.email}) - ID: {student._id}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-light mt-4 px-4">{profile.bio || "This user hasn't added a bio yet."}</p>
                </>
              )}

              <div className="d-flex justify-content-center gap-3 mt-4">
                {profile.skills?.map((skill, idx) => (
                  <span key={idx} className="badge bg-dark border border-secondary p-2">{skill}</span>
                ))}
              </div>

              <div className="d-flex justify-content-center gap-4 mt-4 text-white">
                {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-primary hover-lift"><FaLinkedin size={24}/></a>}
                {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-light hover-lift"><FaGithub size={24}/></a>}
                {profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-info hover-lift"><FaTwitter size={24}/></a>}
              </div>

              <div className="mt-5 pt-4 border-top border-secondary d-flex justify-content-center gap-3">
                {isOwner ? (
                  <>
                    <button 
                      onClick={() => { 
                        if (!isEditing) setEditForm({ mentoringStatus: profile.mentoringStatus || 'Not Mentoring', areasOfInterest: profile.areasOfInterest ? profile.areasOfInterest.join(', ') : '', bio: profile.bio || '' });
                        setIsEditing(!isEditing);
                      }} 
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                    >
                      <Edit2 size={16}/> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                    {isEditing && (
                      <button onClick={handleSaveProfile} className="btn btn-primary-gradient px-4 d-flex align-items-center gap-2">
                        Save Changes
                      </button>
                    )}
                  </>
                ) : (
                  <button className="btn btn-primary-gradient px-4 d-flex align-items-center gap-2">
                    <MessageCircle size={18}/> Message {profile.name.split(' ')[0]}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
