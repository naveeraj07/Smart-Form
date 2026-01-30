import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CSVLink } from "react-csv"; 
import axios from 'axios';

const FormResponses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // ENV Variable support
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const token = localStorage.getItem('token'); // <--- 1. GET TOKEN
        
        const res = await axios.get(`${API_URL}/forms/${id}`, {
            headers: { 'x-auth-token': token } // <--- 2. SEND TOKEN (Security)
        });
        
        setForm(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching responses:", err);
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  // PREPARE DATA FOR CSV EXPORT
  let csvData = [];
  if (form && form.submissions.length > 0) {
    csvData = form.submissions.map((sub) => {
      const row = {
        "Submitted At": new Date(sub.submittedAt).toLocaleString(),
      };
      form.fields.forEach((field) => {
        const val = sub.data[field.label];
        // Handle Arrays (Checkboxes) for CSV
        row[field.label] = Array.isArray(val) ? val.join(', ') : (val || '-');
      });
      return row;
    });
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!form) return <div className="text-center mt-10">Form not found or Access Denied.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      
        {/* Header with DYNAMIC THEME COLOR */}
        <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: form.themeColor || '#2563EB' }}>
          <div>
            <h2 className="text-3xl font-bold">{form.title}</h2>
            <p className="opacity-90 mt-1">{form.submissions.length} Responses collected</p>
          </div>
          
          <Link to="/dashboard" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition text-sm font-medium">
             ← Dashboard
          </Link>
        </div>

        <div className="p-6">
          {/* Toolbar */}
          <div className="flex justify-end mb-6">
            {form.submissions.length > 0 && (
              <CSVLink
                data={csvData}
                filename={`${form.title.replace(/\s+/g, '_')}_responses.csv`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2 transition font-bold"
              >
                📥 Download Excel / CSV
              </CSVLink>
            )}
          </div>

          {/* Responses Table */}
          {form.submissions.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300">
              <p className="text-gray-500">No responses yet. Share your link!</p>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 w-16">#</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 w-48">Submitted At</th>
                    {form.fields.map((field, index) => (
                      <th key={index} className="p-4 text-left text-sm font-semibold text-gray-600 min-w-[150px]">
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {form.submissions.map((sub, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="p-4 text-gray-500 text-sm">{index + 1}</td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(sub.submittedAt).toLocaleString()}
                      </td>
                      {form.fields.map((field, fIndex) => {
                        const cellData = sub.data[field.label];
                        return (
                          <td key={fIndex} className="p-4 text-gray-800 text-sm">
                            {/* 3. FIX: Handle Arrays (Checkboxes) gracefully */}
                            {Array.isArray(cellData) 
                              ? cellData.map(tag => <span key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">{tag}</span>)
                              : (cellData || '-')}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormResponses;