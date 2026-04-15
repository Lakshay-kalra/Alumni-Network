import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateAnnouncement from './pages/CreateAnnouncement';
import Profile from './pages/Profile';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Directory from './pages/Directory';
import Chat from './pages/Chat';
import Home from './pages/Home';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        {user && <Navbar user={user} setUser={setUser} />}
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/announcements/create" element={user && user.role === 'admin' ? <CreateAnnouncement user={user} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={user ? <Profile currentUser={user} /> : <Navigate to="/login" />} />
          <Route path="/events/create" element={user && (user.role === 'admin' || user.role === 'alumni') ? <CreateEvent user={user} /> : <Navigate to="/events" />} />
          <Route path="/events" element={user ? <Events user={user} /> : <Navigate to="/login" />} />
          <Route path="/directory" element={user ? <Directory /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <Chat user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
