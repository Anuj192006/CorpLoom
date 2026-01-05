import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user.role === 'ADMIN') {
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (user.role === 'EMPLOYEE') {
    return (
      <div className="card">
        <h1>Welcome, {user.name}!</h1>
        <p>This is your employee portal. Use the navigation to track your attendance or view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between mb-32">
        <h1>Administrative Dashboard</h1>
      </div>

      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{stats?.totalEmployees || 0}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Active Employees</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.activeEmployees || 0}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">On Leave/Other</div>
          <div className="stat-value" style={{ color: 'var(--secondary)' }}>{stats?.inactiveEmployees || 0}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Attendance Today</div>
          <div className="stat-value">{stats?.attendanceToday || 0}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Department Breakdown</h3>
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Employees</th>
            </tr>
          </thead>
          <tbody>
            {stats?.deptStats?.map((dept, idx) => (
              <tr key={idx}>
                <td>{dept.name}</td>
                <td>{dept.count}</td>
              </tr>
            ))}
            {stats?.deptStats?.length === 0 && (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>No departments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
