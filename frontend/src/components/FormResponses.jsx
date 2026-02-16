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
        const token = localStorage.getItem('token'); 
        const res = await axios.get(`${API_URL}/forms/${id}`, {
            headers: { 'x-auth-token': token } 
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

  // 🧮 CALCULATE TOTAL POSSIBLE SCORE
  const totalPossibleScore = form?.fields?.reduce((acc, field) => acc + (field.marks || 0), 0) || 0;

  // PREPARE DATA FOR CSV EXPORT
  let csvData = [];
  if (form && form.submissions.length > 0) {
    csvData = form.submissions.map((sub) => {
      const row = {
        "Submitted At": new Date(sub.submittedAt).toLocaleString(),
        // Format Score as "5 / 10" for CSV
        "Score": form.formType === 'quiz' ? `${sub.score || 0} / ${totalPossibleScore}` : 'N/A'
      };
      form.fields.forEach((field) => {
        const val = sub.data[field.label];
        // Handle Arrays (Checkboxes) for CSV
        row[field.label] = Array.isArray(val) ? val.join(', ') : (val || '-');
      });
      return row;
    });
  }

  // 🎨 HELPER: Get Color Badge based on Percentage
  const getScoreColor = (score) => {
    if (totalPossibleScore === 0) return 'text-gray-400';
    const percentage = (score / totalPossibleScore) * 100;
    if (percentage >= 80) return 'text-green-400 bg-green-400/10 border-green-400/20'; // High
    if (percentage >= 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'; // Med
    return 'text-red-400 bg-red-400/10 border-red-400/20'; // Low
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!form) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Form not found or Access Denied.</div>;

  const isQuiz = form.formType === 'quiz';
  const primaryColor = form.themeColor || '#8b5cf6';

  return (
    // 🌟 MAIN WRAPPER
    <div className="min-h-screen w-full bg-[#050505] p-4 md:p-8 text-white relative">
      
      {/* 🌟 GLASS CONTAINER */}
      <div className="max-w-7xl mx-auto bg-[#0f1014]/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col min-h-[80vh]">
        
        {/* TOP GLOW BAR */}
        <div className="h-1 w-full shadow-[0_0_15px_rgba(0,0,0,0.5)]" style={{ backgroundColor: primaryColor }} />

        {/* HEADER */}
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {form.title}
                    </h2>
                    {isQuiz && (
                        <span 
                            className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-current bg-opacity-10"
                            style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                            Quiz Mode
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 font-mono">
                    <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                        📂 {form.submissions.length} Responses
                    </span>
                    <span className="hidden md:inline text-gray-600">|</span>
                    <span>Created: {new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex gap-3">
                <Link 
                    to="/dashboard" 
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition font-medium text-sm"
                >
                    ← Dashboard
                </Link>

                {form.submissions.length > 0 && (
                    <CSVLink
                        data={csvData}
                        filename={`${form.title.replace(/\s+/g, '_')}_responses.csv`}
                        className="px-5 py-2.5 rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition flex items-center gap-2 text-sm"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <span>📥</span> Export CSV
                    </CSVLink>
                )}
            </div>
        </div>

        {/* 🌟 TABLE SECTION */}
        <div className="flex-1 p-0 md:p-8 overflow-hidden flex flex-col">
            {form.submissions.length === 0 ? (
                // Empty State
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl m-4 md:m-0 min-h-[300px] bg-white/5">
                    <div className="text-5xl mb-4 opacity-30">📊</div>
                    <p className="text-gray-400 text-lg">No responses collected yet.</p>
                    <p className="text-gray-600 text-sm mt-2">Share your form link to start gathering data.</p>
                </div>
            ) : (
                // Data Table
                <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-inner bg-[#000000]/20">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider w-16">#</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider min-w-[180px]">Timestamp</th>
                                
                                {isQuiz && (
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider w-32" style={{ color: primaryColor }}>
                                        Score
                                    </th>
                                )}

                                {form.fields.map((field, index) => (
                                    <th key={index} className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider min-w-[200px]">
                                        {field.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {form.submissions.map((sub, index) => (
                                <tr key={index} className="hover:bg-white/5 transition-colors duration-150 group">
                                    <td className="p-5 text-gray-500 font-mono">{index + 1}</td>
                                    <td className="p-5 text-gray-400 font-mono text-xs">
                                        {new Date(sub.submittedAt).toLocaleString()}
                                    </td>

                                    {/* 🎓 SCORE COLUMN WITH BADGE */}
                                    {isQuiz && (
                                        <td className="p-5">
                                            <div className={`inline-flex flex-col items-center justify-center px-3 py-1 rounded-lg border ${getScoreColor(sub.score || 0)}`}>
                                                <span className="font-bold text-base">
                                                    {sub.score || 0} <span className="opacity-50 text-xs">/ {totalPossibleScore}</span>
                                                </span>
                                            </div>
                                        </td>
                                    )}

                                    {form.fields.map((field, fIndex) => {
                                        const cellData = sub.data[field.label];
                                        return (
                                            <td key={fIndex} className="p-5 text-gray-200">
                                                {Array.isArray(cellData) ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {cellData.map(tag => (
                                                            <span key={tag} className="bg-white/10 border border-white/10 px-2 py-1 rounded text-xs text-gray-300">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="line-clamp-2">{cellData || '-'}</span>
                                                )}
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