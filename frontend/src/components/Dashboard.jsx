import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        // Get all forms (using the developer/open route for now to ensure you see them)
        const res = await axios.get('http://localhost:5000/api/forms/user/me', {
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

  // NEW FUNCTION: Copies the form URL to clipboard
  const handleCopyLink = (formId) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard! Share it with anyone.");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Form Builder App</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, <strong>{user?.username}</strong></span>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Forms</h2>
          <Link to="/form/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            + Create New Form
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading forms...</p>
        ) : forms.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center text-gray-500">
            <p>You haven't created any forms yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {forms.map((form) => (
              <div key={form._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex flex-col sm:flex-row justify-between items-center gap-4">
                
                {/* Form Info */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{form.title}</h3>
                  <p className="text-gray-500 text-sm">Created: {new Date(form.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Actions Buttons */}
                <div className="flex gap-2">
                  
                  {/* BUTTON 1: Copy Link (What you asked for) */}
                  <button 
                    onClick={() => handleCopyLink(form._id)}
                    className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded hover:bg-green-200 transition text-sm font-semibold"
                  >
                    🔗 Copy Link
                  </button>

                  {/* BUTTON 2: View Form (Opens in new tab just to check looks) */}
                  <Link 
                    to={`/form/${form._id}`} 
                    target="_blank" 
                    className="text-blue-500 border border-blue-500 px-3 py-1 rounded hover:bg-blue-50 transition text-sm"
                  >
                    Preview
                  </Link>

                  {/* BUTTON 3: View Responses */}
                  <Link 
                    to={`/form/${form._id}/responses`}
                    className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-200 transition text-sm"
                  >
                    Responses ({form.submissions ? form.submissions.length : 0})
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;