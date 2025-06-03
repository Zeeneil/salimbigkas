import './App.css';
import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { createUserDocumentfromAuth } from './firebase/auth';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          await createUserDocumentfromAuth(user); // optional: write to Firestore
          console.log('User signed in with redirect:', user);
          // Navigate to the appropriate dashboard based on user role
          navigate('/student');
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    handleRedirectResult();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
        <Route
          path="/Admin"
          element={
            <ProtectedRoute requireVerifiedEmail={true} requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Teacher"
          element={
            <ProtectedRoute requireVerifiedEmail={true} requiredRole="Teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Student"
          element={
            <ProtectedRoute requireVerifiedEmail={true} requiredRole="Student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
  
}

export default App;