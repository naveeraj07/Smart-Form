import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormBuilder = ({ user }) => {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  // Add a new question
  const addField = () => {
    setFields([
      ...fields,
      {
        label: '',
        fieldType: 'text', 
        required: false,
        options: ['Option 1'] // Default option
      }
    ]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const newFields = [...fields];
    newFields[fieldIndex].options[optionIndex] = value;
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
    if (!title) return alert("Please enter a form title.");

    const formData = {
      title,
      fields, 
      createdBy: user.username
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/forms/create', formData, {
        headers: { 'x-auth-token': token }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save.");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Form</h2>

      <input
        className="w-full border-b-2 border-gray-300 p-3 mb-8 text-2xl focus:outline-none focus:border-blue-500"
        placeholder="Untitled Form"
        onChange={(e) => setTitle(e.target.value)}
      />

      {fields.map((field, index) => (
        <div key={index} className="mb-6 bg-gray-50 p-6 rounded-lg border shadow-sm">
          <div className="flex gap-4 mb-4">
            <input
              placeholder="Question Title"
              className="flex-1 p-3 border rounded focus:ring-2 focus:ring-blue-100 outline-none"
              value={field.label}
              onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
            />
            
            {/* UPDATED DROPDOWN WITH ALL TYPES */}
            <select
              className="p-3 border rounded bg-white w-48 font-medium"
              value={field.fieldType}
              onChange={(e) => handleFieldChange(index, 'fieldType', e.target.value)}
            >
              <option value="text">Short Text</option>
              <option value="textarea">Long Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="radio">Single Choice (Radio)</option>
              <option value="checkbox">Multiple Choice</option>
              <option value="select">Dropdown</option>
            </select>
          </div>

          {/* DYNAMIC OPTIONS SECTION */}
          {/* Only show "Add Option" for types that need lists */}
          {['radio', 'checkbox', 'select'].includes(field.fieldType) && (
            <div className="ml-4 mt-2 pl-4 border-l-2 border-blue-200">
              <p className="text-xs text-gray-500 mb-2 font-bold uppercase">
                {field.fieldType === 'checkbox' ? 'User can pick MANY' : 'User can pick ONE'}
              </p>
              
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 border ${field.fieldType === 'radio' ? 'rounded-full' : 'rounded-sm'} border-gray-400`}></div>
                  
                  <input
                    type="text"
                    className="flex-1 p-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                    value={option}
                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                  />
                  
                  <button 
                    onClick={() => removeOption(index, optIndex)}
                    className="text-red-500 hover:text-red-700 px-2 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => addOption(index)}
                className="text-sm text-blue-600 hover:underline mt-2 font-medium"
              >
                + Add Option
              </button>
            </div>
          )}

          <div className="flex justify-end mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
              />
              Required Question
            </label>
          </div>
        </div>
      ))}

      <div className="mt-8 flex gap-4">
        <button onClick={addField} className="px-6 py-2 border-2 border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition">
          + Add Question
        </button>
        <button onClick={saveForm} className="bg-blue-600 text-white px-8 py-2 rounded shadow hover:bg-blue-700 transition font-bold ml-auto">
          Save Form
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;