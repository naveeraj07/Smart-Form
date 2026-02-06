import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import Login from './components/Login';
import Register from './components/Register';
import FormBuilder from './components/FormBuilder';
import FormSubmit from './components/FormSubmit';
import Dashboard from './components/Dashboard';
import FormResponses from './components/FormResponses';
import FormSuccess from './components/FormSuccess';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user'); 
    const token = localStorage.getItem('token');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <Routes>
          
          {/* 1. Root Path (Default) */}
          <Route 
            path="/" 
            element={ user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} /> } 
          />

          {/* 2. Login Path (FIXES YOUR CRASH) */}
          <Route 
            path="/login" 
            element={ user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} /> } 
          />
          
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={ user ? <Dashboard user={user} onLogout={handleLogout}/> : <Navigate to="/" /> } 
          />
          
          <Route 
            path="/create" 
            element={ user ? <FormBuilder user={user} /> : <Navigate to="/" /> } 
          />
          
          <Route path="/form/:id" element={<FormSubmit />} />
          
          <Route path="/form-success" element={<FormSuccess />} />

          <Route path="/form/:id/responses" element={<FormResponses />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;