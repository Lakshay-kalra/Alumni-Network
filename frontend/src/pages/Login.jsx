import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../proxy';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(apiUrl('/api/auth/login'), { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card fade-in">
        <div className="text-center mb-4">
          <h2 className="gradient-text fs-1 mb-2">Alumni Network</h2>
          <p className="text-muted">Welcome back! Please login to your account.</p>
        </div>

        {error && <div className="alert alert-danger p-2 text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-light">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary-gradient w-100 text-white">
            Sign In
          </button>
        </form>

        <div className="text-center mt-4 text-muted">
          Don't have an account? <Link to="/register" className="text-primary text-decoration-none ms-1">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
