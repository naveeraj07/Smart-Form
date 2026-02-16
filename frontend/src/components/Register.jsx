import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Derived state
  const passwordsMatch = formData.password === confirmPassword;

  // --- PASSWORD VALIDATION LOGIC (Kept same) ---
  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character (!@#$%^&*).";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordsMatch) {
      setError("Passwords do not match!");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Username may already exist.');
    }
  };

  return (
    // 🌟 MAIN CONTAINER: Transparent (uses body mesh background)
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      
      {/* 🌟 GLASS CARD */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-blue-500/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-50%] w-full h-full bg-purple-500/20 blur-[100px] pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Create Account
          </h2>
          <p className="text-center text-gray-400 text-sm mb-8">Join us to start building amazing forms</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Input */}
            <div>
              <input 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="Choose a Username"
                required
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            {/* Password Input */}
            <div>
              <input 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                type="password" 
                placeholder="Password"
                required
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value});
                  if(error) setError(''); 
                }}
              />
              <p className="text-[10px] text-gray-500 mt-2 ml-1">
                * Min 8 chars, 1 number, 1 special char (!@#$%^&*)
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <input 
                className={`w-full bg-black/20 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all ${
                  confirmPassword && !passwordsMatch 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-white/10 focus:border-purple-500/50'
                }`}
                type="password" 
                placeholder="Re-Enter Password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={confirmPassword && !passwordsMatch}
              className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 ${
                !passwordsMatch && confirmPassword
                  ? 'bg-gray-600/50 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-purple-500/20'
              }`}
            >
              Register
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline decoration-blue-500/30 underline-offset-4">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;