import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
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
          
          {/* --- FIX IS HERE: Points to "/create", NOT "/form/create" --- */}
          <Link 
            to="/create" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
          >
            + Create New Form
          </Link>
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
              <h3 className="text-xl font-bold mb-2 text-gray-800 truncate">{form.title}</h3>
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
    </div>
  );
};

export default Dashboard;