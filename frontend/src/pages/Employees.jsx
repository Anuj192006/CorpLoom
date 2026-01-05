import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Employees = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [depts, setDepts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    departmentId: '',
    orgRoleId: '',
    status: 'ACTIVE',
    dateOfJoining: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, deptRes, roleRes] = await Promise.all([
        fetch('/api/employees', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/org/departments', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/org/roles', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      const empData = await empRes.json();
      const deptData = await deptRes.json();
      const roleData = await roleRes.json();
      setEmployees(empData);
      setDepts(deptData);
      setRoles(roleData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    if (user.employee) {
      setEditForm({
        departmentId: user.employee.departmentId,
        orgRoleId: user.employee.orgRoleId,
        status: user.employee.status,
        dateOfJoining: new Date(user.employee.dateOfJoining).toISOString().split('T')[0]
      });
    } else {
      setEditForm({
        departmentId: '',
        orgRoleId: '',
        status: 'ACTIVE',
        dateOfJoining: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/employees/setup/${editingId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEditingId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Employee Management</h1>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Dept / Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name} {emp.role === 'ADMIN' && '(Admin)'}</td>
                <td>{emp.email}</td>
                <td>
                  {emp.employee ? (
                    <span style={{ fontSize: '12px' }}>
                      {emp.employee.department.name} / {emp.employee.orgRole.name}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--secondary)' }}>Profile pending</span>
                  )}
                </td>
                <td>
                   <span style={{ fontSize: '12px', fontWeight: 'bold', color: emp.employee?.status === 'ACTIVE' ? 'var(--success)' : 'orange' }}>
                    {emp.employee?.status || 'N/A'}
                   </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(emp)} className="btn btn-secondary" style={{ marginRight: '5px', padding: '4px 8px' }}>Edit</button>
                  {emp.role !== 'ADMIN' && <button onClick={() => handleDelete(emp.id)} className="btn btn-danger" style={{ padding: '4px 8px' }}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Edit Profile: {employees.find(e => e.id === editingId)?.name}</h3>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '1rem' }}>
            <div className="form-group">
              <label>Department</label>
              <select value={editForm.departmentId} onChange={(e) => setEditForm({...editForm, departmentId: e.target.value})} required>
                <option value="">Select Dept</option>
                {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Managerial Role</label>
              <select value={editForm.orgRoleId} onChange={(e) => setEditForm({...editForm, orgRoleId: e.target.value})} required>
                <option value="">Select Role</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="RESIGNED">Resigned</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Joining</label>
              <input type="date" value={editForm.dateOfJoining} onChange={(e) => setEditForm({...editForm, dateOfJoining: e.target.value})} required />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="btn">Save Profile</button>
              <button onClick={() => setEditingId(null)} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Employees;
