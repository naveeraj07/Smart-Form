import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed. Username may exist.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-6 font-bold text-center text-green-600">Register</h2>
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
        <button className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded font-bold transition">Register</button>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;