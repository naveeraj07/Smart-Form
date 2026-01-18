import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onCreateNew, onLogout }) => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/forms/user/me', {
          headers: { 'x-auth-token': token }
        });
        setForms(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchForms();
  }, [navigate]);

  const copyLink = (id) => {
    const link = `${window.location.origin}/form/${id}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Forms</h1>
        <Link to="/form/create" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          + Create New Form
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forms.map((form) => (
          <div key={form._id} className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">{form.title}</h3>
              <button 
                onClick={() => copyLink(form._id)} 
                className="text-sm text-blue-500 hover:underline font-medium"
              >
                Share Link 🔗
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-semibold text-gray-700 mb-2">
                Submissions ({form.submissions.length})
              </p>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {form.submissions.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">No submissions yet.</p>
                ) : (
                  form.submissions.map((sub, idx) => (
                    <div key={idx} className="text-sm border-b pb-1 text-gray-600">
                      {Object.entries(sub.data).map(([key, val]) => (
                        <span key={key} className="mr-3">
                          <strong>{key}:</strong> {val}
                        </span>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;