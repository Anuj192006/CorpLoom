import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form card">
      <h2>Login</h2>
      {error && <p className="card" style={{ color: 'var(--danger)', background: '#fee2e2' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }}>Sign In</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '14px' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '14px' }}>
        Create a new company? <Link to="/register-company">Register Company</Link>
      </p>
    </div>
  );
};

export default Login;
