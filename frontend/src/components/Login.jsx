import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      
      localStorage.setItem('token', res.data.token);

      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate('/dashboard');
      } else {
        alert("Login successful, but user data is missing.");
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    // 🌟 MAIN CONTAINER: Centered, Transparent (uses body mesh background)
    <div className="flex h-screen w-full items-center justify-center p-4">
      
      {/* 🌟 GLASS CARD */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glows inside the card */}
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-blue-500/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-50%] w-full h-full bg-purple-500/20 blur-[100px] pointer-events-none"></div>

        {/* Content Layer (z-10 to sit above glows) */}
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              Welcome Back 👋
            </h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Input */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Username</label>
              <input 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="e.g. johndoe"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Password</label>
              <input 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                type="password" 
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {/* Login Button */}
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-95 mt-4">
              Log In
            </button>
            
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline decoration-blue-500/30 underline-offset-4">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;