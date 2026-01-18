import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormBuilder = () => {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  const addField = () => {
    setFields([...fields, { label: '', fieldType: 'text', required: false }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const saveForm = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/forms/create', 
        { title, fields }, 
        { headers: { 'x-auth-token': token } }
      );
      alert('Form Created!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Form</h2>
      <input 
        className="w-full border-2 border-gray-300 p-3 mb-6 rounded text-lg focus:outline-none focus:border-blue-500" 
        placeholder="Enter Form Title" 
        onChange={(e) => setTitle(e.target.value)} 
      />
      
      {fields.map((field, index) => (
        <div key={index} className="flex gap-4 mb-4 items-center bg-gray-50 p-4 rounded border">
          <input 
            placeholder="Field Label (e.g., Your Name)" 
            className="border p-2 rounded flex-1"
            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
          />
          <select 
            className="border p-2 rounded bg-white"
            onChange={(e) => handleFieldChange(index, 'fieldType', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
          </select>
        </div>
      ))}

      <div className="mt-6 flex gap-4">
        <button onClick={addField} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
          + Add Field
        </button>
        <button onClick={saveForm} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold">
          Save Form
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;