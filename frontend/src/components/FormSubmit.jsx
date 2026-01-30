import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormSubmit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`${API_URL}/forms/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
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

  // ---------------------------------------------------------
  // 1. ✨ THE LOGIC ENGINE (Helper Function)
  // ---------------------------------------------------------
  const shouldShowField = (field) => {
    // If no logic is defined, always show
    if (!field.logic || !field.logic.targetField) return true;

    // Get the User's Answer to the "Trigger Question"
    const targetAnswer = formData[field.logic.targetField];
    const requiredValue = field.logic.targetValue;

    // If trigger question hasn't been answered yet, hide this field
    if (!targetAnswer) return false;

    // Check if the answer matches
    // (Handles both simple text and array/checkbox answers)
    if (Array.isArray(targetAnswer)) {
      return targetAnswer.includes(requiredValue);
    }
    
    return targetAnswer.toString().trim().toLowerCase() === requiredValue.toString().trim().toLowerCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------------
    // 2. ✨ SMARTER VALIDATION
    // Only validate fields that are actually VISIBLE
    // ---------------------------------------------------------
    for (const field of form.fields) {
      
      // SKIP validation if the field is hidden by logic
      if (!shouldShowField(field)) continue;

      // Check Required Text/Radio/Select
      if (field.required && !['checkbox'].includes(field.fieldType)) {
        if (!formData[field.label]) {
            alert(`Please answer: ${field.label}`);
            return;
        }
      }

      // Check Required Checkboxes
      if (field.required && field.fieldType === 'checkbox') {
        const answers = formData[field.label] || [];
        if (answers.length === 0) {
          alert(`Please select at least one option for: ${field.label}`);
          return;
        }
      }
    }

    try {
      await axios.post(`${API_URL}/forms/submit/${id}`, { data: formData });
      navigate('/form-success'); 
    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  if (!form) return <div className="text-center mt-10">Loading Form...</div>;

  const primaryColor = form.themeColor || '#2563EB';

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 text-white" style={{ backgroundColor: primaryColor }}>
          <h1 className="text-3xl font-bold">{form.title}</h1>
          <p className="opacity-90 mt-2">Please complete the form below.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {form.fields.map((field, idx) => {
            
            // ---------------------------------------------------------
            // 3. ✨ APPLY LOGIC TO RENDERING
            // If the logic says hide, we return null (render nothing)
            // ---------------------------------------------------------
            if (!shouldShowField(field)) return null;

            return (
              <div key={idx} className="animate-fade-in-down"> {/* Added animation class */}
                <label className="block font-bold text-gray-700 mb-3 text-lg">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

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
                      <label key={i} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
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
            className="w-full text-white font-bold py-4 rounded-lg text-lg shadow-lg transform active:scale-95 transition"
            style={{ backgroundColor: primaryColor }}
          >
            Submit Response
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSubmit;