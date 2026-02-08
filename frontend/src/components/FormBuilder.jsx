import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const FormBuilder = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // Added Description
  const [themeColor, setThemeColor] = useState('#2563EB'); 
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // GET FORM TYPE
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
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
           {isQuiz ? "🎓 Create Quiz" : "📋 Create Smart Form"}
        </h2>
        
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded border">
          <span className="text-sm font-semibold text-gray-600">Theme:</span>
          <input 
            type="color" 
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="h-8 w-10 cursor-pointer border-0 p-0 bg-transparent rounded"
          />
        </div>
      </div>

      <input
        className="w-full border-b-4 p-3 mb-4 text-2xl focus:outline-none placeholder-gray-300 transition-colors"
        placeholder={isQuiz ? "Untitled Quiz" : "Untitled Form"}
        onChange={(e) => setTitle(e.target.value)}
        style={{ borderColor: themeColor }}
      />
      
      <textarea
        className="w-full border-b p-2 mb-8 text-sm text-gray-600 focus:outline-none placeholder-gray-300 resize-none"
        placeholder="Form Description (Optional)"
        onChange={(e) => setDescription(e.target.value)}
      />

      {fields.map((field, index) => (
        <div key={index} className="mb-6 bg-gray-50 p-6 rounded-lg border shadow-sm relative transition-all hover:shadow-md">
          
          <button 
            onClick={() => { const f = [...fields]; f.splice(index, 1); setFields(f); }} 
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 font-bold text-xl px-2"
            title="Remove Question"
          >
            ×
          </button>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Question</label>
                    {isQuiz && (
                        <div className="flex items-center gap-1">
                            <label className="text-xs font-bold text-purple-600">Points:</label>
                            <input 
                                type="number" 
                                min="0"
                                className="w-16 text-xs p-1 border border-purple-300 rounded text-center"
                                value={field.marks}
                                onChange={(e) => handleFieldChange(index, 'marks', parseInt(e.target.value))}
                            />
                        </div>
                    )}
                </div>
                
                <input
                    placeholder="e.g. What is the capital of France?"
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-100 outline-none"
                    value={field.label}
                    onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                />
            </div>
            
            <div className="w-full md:w-48">
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Type</label>
                <select
                    className="w-full p-3 border rounded bg-white font-medium"
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
            </div>
          </div>

          {['radio', 'checkbox', 'select'].includes(field.fieldType) && (
            <div className="ml-2 mb-6 pl-4 border-l-4 border-gray-200">
              <div className="flex justify-between mb-2">
                <p className="text-xs text-gray-500 font-bold uppercase">Options</p>
                {isQuiz && <p className="text-xs text-green-600 font-bold uppercase mr-8">Correct Answer?</p>}
              </div>

              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2 mb-2">
                  {isQuiz && (
                    <input 
                        type="radio"
                        name={`correct-${index}`}
                        checked={field.correctAnswer === option}
                        onChange={() => handleFieldChange(index, 'correctAnswer', option)}
                        className="w-4 h-4 text-green-600 cursor-pointer accent-green-600"
                        title="Mark as correct answer"
                    />
                  )}
                  <input
                    type="text"
                    className={`flex-1 p-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none ${isQuiz && field.correctAnswer === option ? 'text-green-700 font-bold' : ''}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                  />
                  <button onClick={() => removeOption(index, optIndex)} className="text-red-400 hover:text-red-600 font-bold">×</button>
                </div>
              ))}
              
              <button 
                onClick={() => addOption(index)}
                className="text-sm font-bold hover:underline mt-1"
                style={{ color: themeColor }}
              >
                + Add Option
              </button>
            </div>
          )}

          {/* ✨ FIX: LOGIC IS NOW AVAILABLE FOR BOTH QUIZ AND FORMS */}
          <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⚡ LOGIC</span>
                  <span className="text-xs text-gray-500">Only show this question if...</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded border text-sm">
                  <span>If answer to</span>
                  <select 
                      className="border p-2 rounded bg-gray-50 max-w-[200px]"
                      value={field.logic?.targetField || ''}
                      onChange={(e) => handleLogicChange(index, 'targetField', e.target.value)}
                  >
                      <option value="">-- Always Show --</option>
                      {fields.map((f, i) => (
                          i < index && f.label ? <option key={i} value={f.label}>{f.label}</option> : null
                      ))}
                  </select>
                  <span>equals</span>
                  <input 
                      type="text" 
                      placeholder="Value (e.g. Yes)"
                      className="border p-2 rounded w-32"
                      value={field.logic?.targetValue || ''}
                      onChange={(e) => handleLogicChange(index, 'targetValue', e.target.value)}
                  />
              </div>
          </div>

          <div className="flex justify-end mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                className="accent-blue-600"
              />
              Required Question
            </label>
          </div>
        </div>
      ))}

      <div className="mt-8 flex gap-4">
        <button onClick={addField} className="px-6 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded hover:bg-gray-50 transition flex-1">
          + Add Question
        </button>
        <button 
          onClick={saveForm} 
          className="text-white px-8 py-3 rounded shadow-lg hover:opacity-90 transition font-bold flex-1"
          style={{ backgroundColor: themeColor }}
        >
          {isQuiz ? "💾 Save Quiz" : "💾 Save Form"}
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;