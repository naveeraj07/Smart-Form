import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Accept 'user' as a prop here
const FormBuilder = ({ user }) => {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  const addField = () => {
    setFields([
      ...fields,
      {
        label: '',
        fieldType: 'text',
        required: false,
        options: []
      }
    ]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const saveForm = async () => {
    // 2. Security Check: Ensure user is logged in
    if (!user) {
      alert("Please log in to create a form.");
      return;
    }

    const token = localStorage.getItem('token');
    
    // 3. Construct the data object
    // We map 'fields' to 'inputs' just in case your backend uses that name, 
    // but we also send 'fields' to be safe.
    const formData = {
      title,
      inputs: fields,      // Some backends expect 'inputs'
      fields: fields,      // Your code uses 'fields'
      createdBy: user.username // <--- THE MISSING PIECE causing the 500 Error
    };

    try {
      await axios.post(
        'http://localhost:5000/api/forms/create',
        formData,
        { headers: { 'x-auth-token': token } }
      );
      alert('Form Created Successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save. Check console for details.");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Form</h2>

      <input
        className="w-full border-2 border-gray-300 p-3 mb-6 rounded text-lg"
        placeholder="Enter Form Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      {fields.map((field, index) => (
        <div key={index} className="mb-5 bg-gray-50 p-4 rounded border">
          <input
            placeholder="Field Label"
            className="border p-2 rounded w-full mb-3"
            value={field.label}
            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
          />

          <select
            className="border p-2 rounded w-full mb-3"
            value={field.fieldType}
            onChange={(e) => handleFieldChange(index, 'fieldType', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="textarea">Textarea</option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
            <option value="select">Dropdown</option>
          </select>

          {(field.fieldType === 'radio' ||
            field.fieldType === 'checkbox' ||
            field.fieldType === 'select') && (
            <input
              placeholder="Options (comma separated)"
              className="border p-2 rounded w-full mb-3"
              // Join array back to string for display if needed, or handle simple input
              onChange={(e) =>
                handleFieldChange(
                  index,
                  'options',
                  e.target.value.split(',')
                )
              }
            />
          )}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                handleFieldChange(index, 'required', e.target.checked)
              }
            />
            Required
          </label>
        </div>
      ))}

      <div className="mt-6 flex gap-4">
        <button
          onClick={addField}
          className="bg-gray-600 text-white px-6 py-2 rounded"
        >
          + Add Field
        </button>

        <button
          onClick={saveForm}
          className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700"
        >
          Save Form
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;