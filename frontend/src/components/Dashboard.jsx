import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/forms/my-forms`, {
          headers: { 'x-auth-token': token }
        });
        setForms(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const handleCopyLink = (formId) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!"); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/forms/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setForms(forms.filter(form => form._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete form.");
    }
  };

  const handleCreate = (type) => {
    setShowTypeModal(false); 
    navigate('/create', { state: { formType: type } });
  };

  return (
    // 🌟 MAIN CONTAINER: Transparent so body mesh shows through
    <div className="min-h-screen p-4 md:p-8 text-white">
      
      {/* 🌟 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome back, <span className="text-white font-semibold">{user?.username}</span> 👋
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onLogout} 
            className="px-5 py-2.5 rounded-xl text-red-400 font-semibold hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
          >
            Logout
          </button>
          
          <button 
            onClick={() => setShowTypeModal(true)} 
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 active:scale-95 transition-all"
          >
            + Create New
          </button>
        </div>
      </div>

      {/* 🌟 CONTENT GRID */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : forms.length === 0 ? (
        // Empty State
        <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
          <div className="text-6xl mb-4 grayscale opacity-50">📂</div>
          <p className="text-gray-400 text-xl font-light">You haven't created any forms yet.</p>
          <button 
            onClick={() => setShowTypeModal(true)}
            className="mt-6 text-blue-400 hover:text-blue-300 font-semibold hover:underline decoration-blue-500/30 underline-offset-4"
          >
            Start your first project &rarr;
          </button>
        </div>
      ) : (
        // Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div 
              key={form._id} 
              // ✨ CHANGED HERE: bg-white/5 for contrast against dark background
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Colored Top Glow Bar */}
              <div 
                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ background: form.themeColor || 'linear-gradient(to right, #3b82f6, #8b5cf6)' }} 
              />

              {/* Title & Badge */}
              <div className="flex justify-between items-start mb-4 mt-2">
                <h3 className="text-xl font-bold text-white truncate flex-1 pr-3 group-hover:text-blue-200 transition-colors">
                  {form.title}
                </h3>
                {form.formType === 'quiz' && (
                  <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    Quiz
                  </span>
                )}
              </div>
              
              {/* Meta Info */}
              <div className="flex justify-between items-center mb-6 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1">
                  📅 {new Date(form.createdAt).toLocaleDateString()}
                </span>
                <span className="bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-300">
                  {form.submissions.length} Responses
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                <Link 
                  to={`/form/${form._id}/responses`}
                  className="flex items-center justify-center w-full gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-white font-medium transition-all group-hover:border-white/20"
                >
                  📊 View Analytics
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleCopyLink(form._id)}
                    className="flex items-center justify-center gap-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 py-2 rounded-xl text-sm font-semibold transition border border-transparent hover:border-blue-500/30"
                  >
                    🔗 Copy
                  </button>

                  <Link 
                    to={`/form/${form._id}`} 
                    target="_blank"
                    className="flex items-center justify-center gap-2 bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 py-2 rounded-xl text-sm font-semibold transition border border-transparent hover:border-gray-500/30"
                  >
                    👁 Preview
                  </Link>
                </div>

                <button 
                    onClick={() => handleDelete(form._id)}
                    className="w-full text-red-400/70 hover:text-red-300 hover:bg-red-500/10 py-2 rounded-xl text-xs font-semibold transition mt-2 opacity-0 group-hover:opacity-100"
                >
                    🗑 Delete Form
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🌟 MODAL */}
      {showTypeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-[#121212] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden ring-1 ring-white/10">
            {/* Ambient Glows */}
            <div className="absolute -top-20 -left-20 w-56 h-56 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-purple-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

            <h2 className="text-3xl font-bold mb-2 text-white relative z-10">Create New</h2>
            <p className="text-gray-400 mb-8 text-sm relative z-10">Select the type of form you want to build</p>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <button 
                onClick={() => handleCreate('form')}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/50 transition-all group flex flex-col items-center hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-bold text-white group-hover:text-blue-400">Survey</h3>
                <p className="text-[10px] text-gray-500 mt-1 group-hover:text-gray-400">Data Collection</p>
              </button>

              <button 
                onClick={() => handleCreate('quiz')}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all group flex flex-col items-center hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/20"
              >
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="font-bold text-white group-hover:text-purple-400">Quiz</h3>
                <p className="text-[10px] text-gray-500 mt-1 group-hover:text-gray-400">Scoring & Points</p>
              </button>
            </div>

            <button 
              onClick={() => setShowTypeModal(false)}
              className="mt-8 text-gray-500 hover:text-white text-sm font-medium transition relative z-10 hover:underline underline-offset-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;