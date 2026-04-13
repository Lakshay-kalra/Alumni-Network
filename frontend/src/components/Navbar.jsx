import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, MessageSquare, User, LogOut } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/directory', label: 'Network', icon: Users },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/chat', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand gradient-text fs-4" to="/">Alumni Network</Link>
        <button className="navbar-toggler bg-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <li className="nav-item mx-2" key={link.path}>
                  <Link className={`nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`} to={link.path}>
                    <Icon size={18} className={isActive ? 'text-primary' : ''} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
            
            <li className="nav-item dropdown ms-3">
              <a className="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="profile-img-sm" />
                ) : (
                  <div className="profile-img-sm bg-primary d-flex align-items-center justify-content-center text-white">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span>{user.name}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end bg-dark border-secondary">
                <li>
                  <Link className="dropdown-item text-light d-flex align-items-center gap-2" to={`/profile/${user._id}`}>
                    <User size={16} /> Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider border-secondary" /></li>
                <li>
                  <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
