import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { user, token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const url = user.role === 'ADMIN' ? 'all' : 'my';
      const res = await fetch(`http://localhost:5001/api/attendance/${url}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/attendance/checkin', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchRecords();
      else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/attendance/checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '--:--';
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex-between mb-32">
        <h1>Attendance Tracking</h1>
        {user.role === 'EMPLOYEE' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleCheckIn} className="btn">Check In Today</button>
            <button onClick={handleCheckOut} className="btn btn-secondary">Check Out</button>
          </div>
        )}
      </div>

      <div className="card">
        <h3>{user.role === 'ADMIN' ? 'Company Log' : 'My Logs'}</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              {user.role === 'ADMIN' && <th>Employee</th>}
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => (
              <tr key={rec.id}>
                <td>{new Date(rec.date).toLocaleDateString()}</td>
                {user.role === 'ADMIN' && <td>{rec.user.name}</td>}
                <td>{formatTime(rec.checkIn)}</td>
                <td>{formatTime(rec.checkOut)}</td>
                <td>
                  <span style={{ fontSize: '12px', color: rec.checkOut ? 'var(--success)' : 'orange' }}>
                    {rec.checkOut ? 'Completed' : 'Active Session'}
                  </span>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={user.role === 'ADMIN' ? 5 : 4} style={{ textAlign: 'center' }}>No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
