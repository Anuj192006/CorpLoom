import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      fetch('/api/employees/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setProfile(data));
    }
  }, [token]);

  if (!profile) return <div>Loading Profile...</div>;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Employee Record</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '15px', marginTop: '20px' }}>
        <div style={{ fontWeight: 'bold' }}>Name:</div>
        <div>{profile.name}</div>
        
        <div style={{ fontWeight: 'bold' }}>Work Email:</div>
        <div>{profile.email}</div>

        <div style={{ fontWeight: 'bold' }}>Company:</div>
        <div>{profile.company?.name || 'N/A'}</div>

        <div style={{ fontWeight: 'bold' }}>Department:</div>
        <div>{profile.employee?.department?.name || 'Unassigned'}</div>

        <div style={{ fontWeight: 'bold' }}>Designation:</div>
        <div>{profile.employee?.orgRole?.name || 'Unassigned'}</div>

        <div style={{ fontWeight: 'bold' }}>Status:</div>
        <div style={{ color: profile.employee?.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)' }}>
          {profile.employee?.status || 'PENDING SETUP'}
        </div>

        <div style={{ fontWeight: 'bold' }}>Join Date:</div>
        <div>{profile.employee?.dateOfJoining ? new Date(profile.employee.dateOfJoining).toLocaleDateString() : 'N/A'}</div>
      </div>
      
      <div style={{ marginTop: '30px', padding: '15px', background: '#f8fafc', borderRadius: '4px', fontSize: '13px' }}>
        <p><strong>Security Info:</strong> You are logged in with {profile.role} privileges. Contact your Admin for profile updates.</p>
      </div>
    </div>
  );
};

export default Profile;
