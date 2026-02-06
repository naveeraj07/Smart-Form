import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // ⚡ FIX: Use the Environment Variable (or localhost as backup)
  // ---------------------------------------------------------
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Derived state: check if passwords match
  const passwordsMatch = formData.password === confirmPassword;

  // --- PASSWORD VALIDATION LOGIC ---
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*).";
    }
    return null; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Check Matching
    if (!passwordsMatch) {
      setError("Passwords do not match!");
      return;
    }

    // 2. Check Password Strength
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // 3. Submit to Backend (Dynamic URL)
    try {
      // ⚡ FIX: Using API_URL here
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      
      localStorage.setItem('token', res.data.token);
      
      // Note: Ideally, you should also update 'setUser' state here like we did in Login,
      // but for now, this will get you to the dashboard.
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Username may already exist.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-6 font-bold text-center text-green-600">Register</h2>
        
        {/* Username Input */}
        <input 
          className="w-full border p-3 mb-4 rounded focus:outline-green-500" 
          placeholder="Username"
          required
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />

        {/* Password Input */}
        <div className="mb-4">
          <input 
            className="w-full border p-3 rounded focus:outline-green-500" 
            type="password" 
            placeholder="Password"
            required
            onChange={(e) => {
              setFormData({...formData, password: e.target.value});
              if(error) setError(''); 
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            * Min 8 chars, 1 number, 1 special char.
          </p>
        </div>

        {/* Re-enter Password Input */}
        <input 
          className="w-full border p-3 mb-2 rounded focus:outline-green-500" 
          type="password" 
          placeholder="Re-Enter Password"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {confirmPassword && !passwordsMatch && (
          <p className="text-red-500 text-xs mb-4">Passwords do not match</p>
        )}

        {error && (
          <p className="text-red-600 text-sm font-semibold mb-4 text-center bg-red-50 p-2 rounded border border-red-200">
            {error}
          </p>
        )}

        <button 
          type="submit"
          disabled={confirmPassword && !passwordsMatch}
          className={`w-full py-3 rounded font-bold transition text-white ${
            !passwordsMatch ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;