import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormSubmit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`${API_URL}/forms/${id}`);
        setForm(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleChange = (label, value) => {
    setFormData({ ...formData, [label]: value });
  };

  const handleCheckbox = (label, value) => {
    const currentList = formData[label] || [];
    if (currentList.includes(value)) {
      setFormData({ ...formData, [label]: currentList.filter((v) => v !== value) });
    } else {
      setFormData({ ...formData, [label]: [...currentList, value] });
    }
  };

  const shouldShowField = (field) => {
    if (!field.logic || !field.logic.targetField) return true;
    const targetAnswer = formData[field.logic.targetField];
    const requiredValue = field.logic.targetValue;
    if (!targetAnswer) return false;
    
    if (Array.isArray(targetAnswer)) return targetAnswer.includes(requiredValue);
    return targetAnswer.toString().trim().toLowerCase() === requiredValue.toString().trim().toLowerCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. VALIDATION
    for (const field of form.fields) {
      if (!shouldShowField(field)) continue;
      if (field.required && !['checkbox'].includes(field.fieldType)) {
        if (!formData[field.label]) return alert(`Please answer: ${field.label}`);
      }
      if (field.required && field.fieldType === 'checkbox') {
        const answers = formData[field.label] || [];
        if (answers.length === 0) return alert(`Please select option for: ${field.label}`);
      }
    }

    // 2. 🧠 CALCULATE SCORE (If it's a Quiz)
    let score = 0;
    let totalMarks = 0;

    if (form.formType === 'quiz') {
      form.fields.forEach(field => {
        // Only grade visible questions
        if (shouldShowField(field)) {
          totalMarks += (field.marks || 0);
          
          const userAnswer = formData[field.label];
          // Simple string comparison for grading
          if (userAnswer === field.correctAnswer) {
            score += (field.marks || 0);
          }
        }
      });
    }

    try {
      // 3. SEND DATA + SCORE TO BACKEND
      await axios.post(`${API_URL}/forms/submit/${id}`, { 
        data: formData,
        score: score // Sending the calculated score
      });

      // 4. NAVIGATE TO SUCCESS PAGE (Pass score in state)
      navigate('/form-success', { 
        state: { 
          isQuiz: form.formType === 'quiz',
          score: score,
          total: totalMarks
        } 
      }); 

    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading Form...</div>;
  if (!form) return <div className="text-center mt-10 text-red-500">Form not found.</div>;

  const primaryColor = form.themeColor || '#2563EB';

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 text-white" style={{ backgroundColor: primaryColor }}>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{form.title}</h1>
            {form.formType === 'quiz' && (
               <span className="bg-white/20 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Quiz</span>
            )}
          </div>
          <p className="opacity-90 mt-2">{form.description || "Please complete the form below."}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {form.fields.map((field, idx) => {
            if (!shouldShowField(field)) return null;

            return (
              <div key={idx} className="animate-fade-in-down">
                <div className="flex justify-between items-center mb-2">
                    <label className="block font-bold text-gray-700 text-lg">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {/* SHOW POINTS IF QUIZ */}
                    {form.formType === 'quiz' && field.marks > 0 && (
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {field.marks} pts
                        </span>
                    )}
                </div>

                {/* TEXT / EMAIL / NUMBER / TEXTAREA */}
                {['text', 'email', 'number', 'textarea'].includes(field.fieldType) && (
                  field.fieldType === 'textarea' ? (
                    <textarea
                      className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-0 transition h-32 outline-none"
                      onFocus={(e) => e.target.style.borderColor = primaryColor}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                    />
                  ) : (
                    <input
                      type={field.fieldType}
                      className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-0 transition outline-none"
                      onFocus={(e) => e.target.style.borderColor = primaryColor}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                    />
                  )
                )}

                {/* RADIO BUTTONS */}
                {field.fieldType === 'radio' && (
                  <div className="space-y-3">
                    {field.options.map((opt, i) => (
                      <label key={i} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${formData[field.label] === opt ? 'bg-blue-50 border-blue-200' : ''}`}>
                        <input
                          type="radio"
                          name={field.label}
                          value={opt}
                          className="w-5 h-5"
                          style={{ accentColor: primaryColor }}
                          onChange={(e) => handleChange(field.label, e.target.value)}
                        />
                        <span className="text-gray-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* CHECKBOXES */}
                {field.fieldType === 'checkbox' && (
                  <div className="space-y-3">
                    {field.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          value={opt}
                          className="w-5 h-5 rounded"
                          style={{ accentColor: primaryColor }}
                          onChange={() => handleCheckbox(field.label, opt)}
                        />
                        <span className="text-gray-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* DROPDOWN SELECT */}
                {field.fieldType === 'select' && (
                  <select
                    className="w-full border-2 border-gray-200 p-3 rounded-lg bg-white outline-none"
                    onFocus={(e) => e.target.style.borderColor = primaryColor}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {field.options.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            className="w-full text-white font-bold py-4 rounded-lg text-lg shadow-lg transform active:scale-95 transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {form.formType === 'quiz' ? 'Submit Quiz' : 'Submit Form'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSubmit;