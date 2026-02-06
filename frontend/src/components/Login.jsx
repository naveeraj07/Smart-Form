import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// 1. Accept 'setUser' as a prop
const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // ⚡ FIX: Use the Environment Variable (or localhost as backup)
  // ---------------------------------------------------------
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the dynamic API_URL here
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      
      // 2. Save Token
      localStorage.setItem('token', res.data.token);

      // 3. Save User Data
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // 4. Update App State
        setUser(res.data.user);
        
        navigate('/dashboard');
      } else {
        alert("Login successful, but user data is missing from server response.");
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-6 font-bold text-center text-blue-600">Login</h2>
        <input 
          className="w-full border p-3 mb-4 rounded" 
          placeholder="Username"
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        <input 
          className="w-full border p-3 mb-6 rounded" 
          type="password" 
          placeholder="Password"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded font-bold transition">Login</button>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;