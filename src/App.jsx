import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AboutUs from './pages/AboutUs';
import News from './pages/News';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ChangePassword from './pages/ChangePassword';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/noticias" element={<News />} />
        
        {/* Auth & Dashboards */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/docente/*" element={<TeacherDashboard />} />
        <Route path="/estudiante/*" element={<StudentDashboard />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
