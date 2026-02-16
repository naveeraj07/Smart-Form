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
          
          // 🔽 UPDATED SMART GRADING LOGIC 🔽
          if (userAnswer) {
             // A. Handle Text/Number/Email Answers (Case-Insensitive Clean-up)
             if (['text', 'email', 'number'].includes(field.fieldType)) {
                 const cleanUser = userAnswer.toString().trim().toLowerCase();
                 const cleanCorrect = (field.correctAnswer || "").toString().trim().toLowerCase();
                 
                 // Only award points if the correct answer is defined and matches
                 if (cleanCorrect !== "" && cleanUser === cleanCorrect) {
                    score += (field.marks || 0);
                 }
             } 
             // B. Handle Radio/Select Answers (Exact Match)
             else {
                 if (userAnswer === field.correctAnswer) {
                    score += (field.marks || 0);
                 }
             }
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
          total: totalMarks,
          title: form.title
        } 
      }); 

    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex justify-center items-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!form) return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-2">404</h1>
        <p className="text-gray-400">Form not found or currently unavailable.</p>
    </div>
  );

  const primaryColor = form.themeColor || '#8b5cf6';

  return (
    // 🌟 FULL PAGE GRADIENT WRAPPER
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center py-10 px-4 relative overflow-hidden">
        
        {/* Background Ambient Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent blur-[100px] pointer-events-none" />
        
        {/* 🌟 GLASS FORM CONTAINER */}
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl relative z-10 overflow-hidden">
            
            {/* PROGRESS BAR STRIP (Decorative) */}
            <div className="h-1 w-full" style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />

            {/* HEADER */}
            <div className="p-8 pb-6 border-b border-white/5 bg-black/20">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {form.title}
                    </h1>
                    {form.formType === 'quiz' && (
                        <span 
                            className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border bg-black/40"
                            style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                            Quiz Mode
                        </span>
                    )}
                </div>
                {form.description && (
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">{form.description}</p>
                )}
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {form.fields.map((field, idx) => {
                    if (!shouldShowField(field)) return null;

                    return (
                        <div key={idx} className="animate-fade-in-up space-y-3 group">
                            <div className="flex justify-between items-center">
                                <label className="block text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
                                    {field.label} {field.required && <span className="text-red-400 text-sm ml-1">*</span>}
                                </label>
                                
                                {/* SHOW POINTS IF QUIZ */}
                                {form.formType === 'quiz' && field.marks > 0 && (
                                    <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                        {field.marks} pts
                                    </span>
                                )}
                            </div>

                            {/* INPUT: TEXT / EMAIL / NUMBER */}
                            {['text', 'email', 'number'].includes(field.fieldType) && (
                                <input
                                    type={field.fieldType}
                                    className="w-full bg-black/30 border border-white/10 p-4 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-opacity-100 transition-all shadow-inner"
                                    placeholder="Type your answer..."
                                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                    onFocus={(e) => { e.target.style.borderColor = primaryColor; e.target.style.boxShadow = `0 0 0 1px ${primaryColor}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                    onChange={(e) => handleChange(field.label, e.target.value)}
                                />
                            )}

                            {/* INPUT: TEXTAREA */}
                            {field.fieldType === 'textarea' && (
                                <textarea
                                    className="w-full bg-black/30 border border-white/10 p-4 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-opacity-100 transition-all shadow-inner h-32 resize-none"
                                    placeholder="Type your detailed answer..."
                                    onFocus={(e) => { e.target.style.borderColor = primaryColor; e.target.style.boxShadow = `0 0 0 1px ${primaryColor}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                    onChange={(e) => handleChange(field.label, e.target.value)}
                                />
                            )}

                            {/* INPUT: SELECT */}
                            {field.fieldType === 'select' && (
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-black/30 border border-white/10 p-4 rounded-xl text-white focus:outline-none transition-all cursor-pointer"
                                        onFocus={(e) => { e.target.style.borderColor = primaryColor; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                        onChange={(e) => handleChange(field.label, e.target.value)}
                                    >
                                        <option value="">-- Select an option --</option>
                                        {field.options.map((opt, i) => (
                                            <option key={i} value={opt} className="bg-gray-900 text-white">{opt}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            )}

                            {/* INPUT: RADIO BUTTONS */}
                            {field.fieldType === 'radio' && (
                                <div className="grid grid-cols-1 gap-3">
                                    {field.options.map((opt, i) => (
                                        <label 
                                            key={i} 
                                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData[field.label] === opt ? 'bg-white/10 border-white/30' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                                            onClick={() => handleChange(field.label, opt)}
                                        >
                                            <div 
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${formData[field.label] === opt ? 'border-transparent' : 'border-gray-500'}`}
                                                style={{ backgroundColor: formData[field.label] === opt ? primaryColor : 'transparent' }}
                                            >
                                                {formData[field.label] === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <span className="text-gray-200 font-medium select-none">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* INPUT: CHECKBOXES */}
                            {field.fieldType === 'checkbox' && (
                                <div className="grid grid-cols-1 gap-3">
                                    {field.options.map((opt, i) => {
                                        const isChecked = (formData[field.label] || []).includes(opt);
                                        return (
                                            <label 
                                                key={i} 
                                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-white/10 border-white/30' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={opt}
                                                    className="hidden" // Hiding default checkbox
                                                    onChange={() => handleCheckbox(field.label, opt)}
                                                />
                                                <div 
                                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isChecked ? 'border-transparent' : 'border-gray-500'}`}
                                                    style={{ backgroundColor: isChecked ? primaryColor : 'transparent' }}
                                                >
                                                    {isChecked && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                    )}
                                                </div>
                                                <span className="text-gray-200 font-medium select-none">{opt}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* SUBMIT BUTTON */}
                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                        style={{ 
                            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                            boxShadow: `0 10px 30px -10px ${primaryColor}66`
                        }}
                    >
                        {form.formType === 'quiz' ? 'Submit Quiz' : 'Submit Form'}
                    </button>
                    <p className="text-center text-gray-600 text-xs mt-4">
                        Powered by <span className="text-gray-400 font-semibold">FormAI</span>
                    </p>
                </div>
            </form>
        </div>
    </div>
  );
};

export default FormSubmit;