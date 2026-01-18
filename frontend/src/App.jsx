import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // <--- 1. IMPORT useState
import Login from './components/Login';
import Register from './components/Register';
import FormBuilder from './components/FormBuilder';
import FormSubmit from './components/FormSubmit';
import Dashboard from './components/Dashboard';
import FormResponses from './components/FormResponses';

function App() {
  // 2. DEFINE THE USER STATE
  const [user, setUser] = useState(null);

  // 3. PERSIST LOGIN: Keep user logged in on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('user'); 
    const token = localStorage.getItem('token');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 4. LOGOUT LOGIC (Deletes token & state)
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <Routes>
          
          {/* LOGIN: We pass setUser so we can update the state when they log in */}
          <Route 
            path="/" 
            element={ user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} /> } 
          />
          
          <Route path="/register" element={<Register />} />
          
          {/* DASHBOARD: We pass 'user' and 'onLogout' */}
          <Route 
            path="/dashboard" 
            element={ 
              user ? <Dashboard user={user} onLogout={handleLogout}/> : <Navigate to="/" /> 
            } 
          />
          
          {/* FORM BUILDER: Now 'user' exists, so this won't crash */}
          <Route 
            path="/form/create" 
            element={ user ? <FormBuilder user={user} /> : <Navigate to="/" /> } 
          />
          
          <Route path="/form/:id" element={<FormSubmit />} />
          <Route path="/form/:id/responses" element={<FormResponses />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;