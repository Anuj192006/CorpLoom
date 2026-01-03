import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterCompany from './pages/RegisterCompany';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  return children;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link to="/dashboard" style={{ fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none', color: 'var(--primary)' }}>
          EMS Portal
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        {user.role === 'ADMIN' && (
          <>
            <Link to="/employees">Employees</Link>
            <Link to="/departments">Org Management</Link>
          </>
        )}
        <Link to="/attendance">Attendance</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={logout} className="btn btn-secondary" style={{ padding: '4px 10px' }}>Logout</button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-company" element={<RegisterCompany />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute adminOnly><Employees /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute adminOnly><Departments /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
