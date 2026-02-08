import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ⚡ 1. NEW STATE: Controls the popup visibility
  const [showTypeModal, setShowTypeModal] = useState(false);
  
  const navigate = useNavigate();

  // ENV Variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        // Retrieve forms
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

  // ⚡ 2. NEW FUNCTION: Handles the user's choice and navigates
  const handleCreate = (type) => {
    setShowTypeModal(false); // Close popup
    // Navigate to builder with the chosen type ('quiz' or 'form')
    navigate('/create', { state: { formType: type } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.username}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onLogout} className="text-red-500 font-semibold hover:underline">
            Logout
          </button>
          
          {/* ⚡ 3. CHANGED: Button opens Modal instead of direct Link */}
          <button 
            onClick={() => setShowTypeModal(true)} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
          >
            + Create New
          </button>
        </div>
      </div>

      {/* FORM GRID */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : forms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">You haven't created any forms yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div 
              key={form._id} 
              className="bg-white p-6 rounded-xl shadow-md border-t-8 hover:shadow-lg transition flex flex-col"
              // DYNAMIC THEME COLOR
              style={{ borderColor: form.themeColor || '#2563EB' }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800 truncate flex-1">{form.title}</h3>
                {/* Optional: Show Badge if it's a Quiz */}
                {form.formType === 'quiz' && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold ml-2">
                    QUIZ
                  </span>
                )}
              </div>
              
              <p className="text-xs text-gray-400 font-mono mb-6">ID: {form._id}</p>
              
              <div className="mt-auto space-y-3">
                 {/* View Responses */}
                <Link 
                  to={`/form/${form._id}/responses`}
                  className="block w-full text-center bg-gray-50 border border-gray-200 py-2 rounded text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  📊 View Responses
                </Link>

                <div className="flex gap-2">
                  {/* Copy Link */}
                  <button 
                    onClick={() => handleCopyLink(form._id)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded font-semibold text-sm hover:bg-blue-100 transition"
                  >
                    🔗 Copy Link
                  </button>

                  {/* Preview Button */}
                  <Link 
                    to={`/form/${form._id}`} 
                    target="_blank"
                    className="flex-1 text-center bg-gray-100 text-gray-600 py-2 rounded font-semibold text-sm hover:bg-gray-200 transition"
                  >
                    👁 Preview
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⚡ 4. THE SELECTION MODAL (Pop-up) */}
      {showTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform transition-all scale-100">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Create New...</h2>
            <p className="text-gray-500 mb-8">What type of form would you like to build?</p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* OPTION A: NORMAL FORM */}
              <button 
                onClick={() => handleCreate('form')}
                className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group flex flex-col items-center"
              >
                <span className="text-4xl mb-3">📋</span>
                <h3 className="font-bold text-gray-700 group-hover:text-blue-600">Survey Form</h3>
                <p className="text-xs text-gray-400 mt-1">Collect data without grading.</p>
              </button>

              {/* OPTION B: QUIZ */}
              <button 
                onClick={() => handleCreate('quiz')}
                className="p-6 border-2 border-gray-100 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group flex flex-col items-center"
              >
                <span className="text-4xl mb-3">🎓</span>
                <h3 className="font-bold text-gray-700 group-hover:text-purple-600">Quiz</h3>
                <p className="text-xs text-gray-400 mt-1">Auto-grading, points & scores.</p>
              </button>
            </div>

            <button 
              onClick={() => setShowTypeModal(false)}
              className="mt-8 text-gray-400 hover:text-gray-600 text-sm font-medium underline"
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