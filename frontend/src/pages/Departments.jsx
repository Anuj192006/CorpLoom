import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Departments = () => {
  const { token } = useAuth();
  const [depts, setDepts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newDept, setNewDept] = useState('');
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dRes, rRes] = await Promise.all([
        fetch('http://localhost:5001/api/org/departments', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5001/api/org/roles', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setDepts(await dRes.json());
      setRoles(await rRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const addDept = async (e) => {
    e.preventDefault();
    if (!newDept) return;
    await fetch('http://localhost:5001/api/org/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: newDept })
    });
    setNewDept('');
    fetchData();
  };

  const addRole = async (e) => {
    e.preventDefault();
    if (!newRole) return;
    await fetch('http://localhost:5001/api/org/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: newRole })
    });
    setNewRole('');
    fetchData();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
      <div>
        <h2>Departments</h2>
        <div className="card">
          <form onSubmit={addDept} className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Add department..." value={newDept} onChange={(e) => setNewDept(e.target.value)} />
            <button className="btn">Add</button>
          </form>
          <table>
            <thead><tr><th>Name</th></tr></thead>
            <tbody>
              {depts.map(d => <tr key={d.id}><td>{d.name}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>Organization Roles</h2>
        <div className="card">
          <form onSubmit={addRole} className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Add role..." value={newRole} onChange={(e) => setNewRole(e.target.value)} />
            <button className="btn">Add</button>
          </form>
          <table>
            <thead><tr><th>Name</th></tr></thead>
            <tbody>
              {roles.map(r => <tr key={r.id}><td>{r.name}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Departments;
