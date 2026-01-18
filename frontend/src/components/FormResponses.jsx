import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FormResponses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/forms/${id}`);
        setForm(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching responses:", err);
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!form) return <div className="text-center mt-10">Form not found</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{form.title} - Responses</h2>
        <Link to="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>

      {/* Stats */}
      <div className="mb-6 text-gray-600">
        Total Responses: <span className="font-bold text-black">{form.submissions.length}</span>
      </div>

      {/* Responses Table */}
      {form.submissions.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded border">
          <p className="text-gray-500">No responses yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            {/* Table Header: Dynamically List Questions */}
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">#</th>
                <th className="border p-3 text-left">Submitted At</th>
                {form.fields.map((field, index) => (
                  <th key={index} className="border p-3 text-left">{field.label}</th>
                ))}
              </tr>
            </thead>
            
            {/* Table Body: List Answers */}
            <tbody>
              {form.submissions.map((sub, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3 text-sm text-gray-500">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </td>
                  {form.fields.map((field, fIndex) => (
                    <td key={fIndex} className="border p-3">
                      {/* We look up the answer by the field label */}
                      {sub.data[field.label] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormResponses;