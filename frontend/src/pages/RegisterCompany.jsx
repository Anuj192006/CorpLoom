import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [successCode, setSuccessCode] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      setSuccessCode(data.companyCode);
      // login(data); // Don't log in yet, show the code first
    } catch (err) {
      setError(err.message);
    }
  };

  if (successCode) {
    return (
      <div className="auth-form card" style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'var(--success)' }}>Company Created!</h2>
        <p>Your unique company code is:</p>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '20px 0', padding: '10px', background: '#f1f5f9', borderRadius: '4px' }}>
          {successCode}
        </div>
        <p style={{ fontSize: '14px', marginBottom: '20px' }}>Share this code with your employees so they can join.</p>
        <button onClick={() => navigate('/login')} className="btn" style={{ width: '100%' }}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="auth-form card">
      <h2>Register Company (Admin)</h2>
      {error && <p className="card" style={{ color: 'var(--danger)', background: '#fee2e2' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Admin Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Admin Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} required />
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }}>Create Company</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '14px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterCompany;
