import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const FormBuilder = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); 
  const [themeColor, setThemeColor] = useState('#8b5cf6'); // Default to purple 
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const formType = location.state?.formType || 'form'; 
  const isQuiz = formType === 'quiz'; 

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (fields.length === 0) addField();
  }, []);

  const addField = () => {
    setFields([
      ...fields,
      {
        label: '',
        fieldType: 'text', 
        required: false,
        options: ['Option 1'],
        logic: { targetField: '', targetValue: '', action: 'show' },
        marks: 0,
        correctAnswer: '' 
      }
    ]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleLogicChange = (index, logicKey, value) => {
    const newFields = [...fields];
    if (!newFields[index].logic) newFields[index].logic = {};
    newFields[index].logic[logicKey] = value;
    setFields(newFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const newFields = [...fields];
    newFields[fieldIndex].options[optionIndex] = value;
    // If we rename the option that was the correct answer, update the correct answer too
    if (newFields[fieldIndex].correctAnswer === fields[fieldIndex].options[optionIndex]) {
        newFields[fieldIndex].correctAnswer = value;
    }
    setFields(newFields);
  };

  const addOption = (fieldIndex) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.push(`Option ${newFields[fieldIndex].options.length + 1}`);
    setFields(newFields);
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(newFields);
  };

  const saveForm = async () => {
    if (!user) return alert("Please log in.");
    if (!title) return alert("Please enter a title.");

    const formData = {
      title,
      description,
      themeColor, 
      fields, 
      createdBy: user.username,
      formType 
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/forms/create`, formData, {
        headers: { 'x-auth-token': token }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save.");
    }
  };

  return (
    // 🌟 MAIN WRAPPER
    <div className="min-h-screen w-full p-4 md:p-8 pb-24 text-white">
      
      {/* 🌟 GLASS PANEL */}
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* HEADER */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <span className="text-xs font-bold tracking-wider text-gray-400 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {isQuiz ? "🎓 Quiz Mode" : "📋 Survey Mode"}
             </span>
          </div>
          
          <div className="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/10">
            <span className="text-xs font-semibold text-gray-400 pl-2">Theme Color:</span>
            <div className="relative overflow-hidden w-8 h-8 rounded-full border border-white/20 cursor-pointer hover:scale-110 transition">
                <input 
                    type="color" 
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                />
            </div>
          </div>
        </div>

        {/* TITLE & DESCRIPTION INPUTS */}
        <div className="relative z-10 mb-10 space-y-4">
            <input
                className="w-full bg-transparent border-b-2 border-white/10 p-2 text-4xl font-bold text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder={isQuiz ? "Untitled Quiz" : "Untitled Form"}
                onChange={(e) => setTitle(e.target.value)}
                style={{ borderColor: title ? themeColor : 'rgba(255,255,255,0.1)' }}
            />
            
            <textarea
                className="w-full bg-transparent border-b border-white/10 p-2 text-gray-300 focus:outline-none focus:border-white/30 placeholder-gray-600 resize-none h-12 focus:h-24 transition-all"
                placeholder="Form Description (Optional)"
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        {/* 🌟 QUESTION CARDS LOOP */}
        <div className="space-y-6 relative z-10">
            {fields.map((field, index) => (
                <div key={index} className="group bg-black/20 backdrop-blur-sm border border-white/5 p-6 rounded-2xl relative transition-all hover:border-white/10 hover:bg-black/30">
                
                {/* Remove Button */}
                <button 
                    onClick={() => { const f = [...fields]; f.splice(index, 1); setFields(f); }} 
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition p-1 rounded-full hover:bg-white/5"
                    title="Remove Question"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {/* Question Input */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Question {index + 1}</label>
                            {isQuiz && (
                                <div className="flex items-center gap-2 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                                    <label className="text-xs font-bold text-purple-400">Points:</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        className="w-12 bg-transparent text-xs text-white border-b border-purple-400/30 text-center focus:outline-none focus:border-purple-400"
                                        value={field.marks}
                                        onChange={(e) => handleFieldChange(index, 'marks', parseInt(e.target.value))}
                                    />
                                </div>
                            )}
                        </div>
                        
                        <input
                            placeholder="e.g. What is the capital of France?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            value={field.label}
                            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                        />
                    </div>
                    
                    {/* Type Selector */}
                    <div className="w-full md:w-48">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">Type</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                                value={field.fieldType}
                                onChange={(e) => handleFieldChange(index, 'fieldType', e.target.value)}
                            >
                                <option value="text">Short Text</option>
                                <option value="textarea">Long Text</option>
                                <option value="email">Email</option>
                                <option value="number">Number</option>
                                <option value="radio">Single Choice</option>
                                <option value="checkbox">Multiple Choice</option>
                                <option value="select">Dropdown</option>
                            </select>
                            {/* Custom Arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🔽 NEW: CORRECT ANSWER INPUT FOR TEXT FIELDS (Only in Quiz Mode) 🔽 */}
                {isQuiz && ['text', 'number', 'email'].includes(field.fieldType) && (
                    <div className="mb-6 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                        <label className="block text-xs font-bold text-green-400 uppercase tracking-wider mb-2">
                           Correct Answer (Auto-Grading)
                        </label>
                        <input
                            type={field.fieldType}
                            value={field.correctAnswer || ''}
                            onChange={(e) => handleFieldChange(index, 'correctAnswer', e.target.value)}
                            className="w-full p-3 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                            placeholder="Type the exact answer here..."
                        />
                        <p className="text-[10px] text-gray-400 mt-2">
                           * User answers will be trimmed and case-insensitive (e.g., "Paris" matches "paris").
                        </p>
                    </div>
                )}

                {/* Options Section (Radio/Checkbox/Select) */}
                {['radio', 'checkbox', 'select'].includes(field.fieldType) && (
                    <div className="ml-1 md:ml-4 mb-6 pl-4 border-l-2 border-white/10">
                    <div className="flex justify-between mb-3">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Options</p>
                        {isQuiz && <p className="text-xs text-green-400 font-bold uppercase mr-8 tracking-wider">Correct Answer</p>}
                    </div>

                    <div className="space-y-3">
                        {field.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                            {isQuiz && (
                            <input 
                                type="radio"
                                name={`correct-${index}`}
                                checked={field.correctAnswer === option}
                                onChange={() => handleFieldChange(index, 'correctAnswer', option)}
                                className="w-4 h-4 accent-green-500 cursor-pointer"
                                title="Mark as correct answer"
                            />
                            )}
                            <div className="flex-1 flex items-center bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors">
                                <input
                                    type="text"
                                    className={`flex-1 bg-transparent p-2 text-sm text-white focus:outline-none ${isQuiz && field.correctAnswer === option ? 'text-green-400 font-bold' : ''}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                />
                                <button 
                                    onClick={() => removeOption(index, optIndex)} 
                                    className="px-3 text-gray-600 hover:text-red-400 transition"
                                >×</button>
                            </div>
                        </div>
                        ))}
                    </div>
                    
                    <button 
                        onClick={() => addOption(index)}
                        className="text-xs font-bold mt-3 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 transition"
                    >
                        + Add Option
                    </button>
                    </div>
                )}

                {/* 🌟 LOGIC SECTION */}
                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Logic Flow</span>
                    </div>

                    <div className="bg-[#121212] border border-white/5 p-4 rounded-xl flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <span>Show this question ONLY if answer to</span>
                        
                        <select 
                            className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-blue-500 outline-none max-w-[150px]"
                            value={field.logic?.targetField || ''}
                            onChange={(e) => handleLogicChange(index, 'targetField', e.target.value)}
                        >
                            <option value="">-- Select Question --</option>
                            {fields.map((f, i) => (
                                i < index && f.label ? <option key={i} value={f.label}>{f.label}</option> : null
                            ))}
                        </select>
                        
                        <span>equals</span>
                        
                        <input 
                            type="text" 
                            placeholder="Value (e.g. Yes)"
                            className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-blue-500 outline-none w-32"
                            value={field.logic?.targetValue || ''}
                            onChange={(e) => handleLogicChange(index, 'targetValue', e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer of Card */}
                <div className="flex justify-end mt-4">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none hover:text-white transition">
                    <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                        className="rounded border-white/20 bg-white/5 accent-blue-500 w-4 h-4"
                    />
                    Required
                    </label>
                </div>
                </div>
            ))}
        </div>

        {/* 🌟 BOTTOM ACTIONS */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 relative z-10">
            <button 
                onClick={addField} 
                className="flex-1 py-4 rounded-xl border-2 border-dashed border-white/10 text-gray-400 font-bold hover:border-white/30 hover:bg-white/5 hover:text-white transition-all active:scale-[0.98]"
            >
            + Add New Question
            </button>
            
            <button 
                onClick={saveForm} 
                className="flex-1 py-4 rounded-xl font-bold text-white shadow-lg shadow-purple-900/20 transform hover:-translate-y-1 hover:shadow-xl transition-all"
                style={{ 
                    background: themeColor ? `linear-gradient(135deg, ${themeColor}, #a855f7)` : 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                }}
            >
            {isQuiz ? "💾 Save Quiz" : "💾 Save Form"}
            </button>
        </div>

      </div>
    </div>
  );
};

export default FormBuilder;