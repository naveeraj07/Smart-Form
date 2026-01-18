import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FormSubmit = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/forms/${id}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/forms/submit/${id}`, { data: formData });
      alert('Form submitted successfully!');
      setFormData({}); // Clear form
    } catch (err) {
      alert('Error submitting form');
    }
  };

  if (!form) return <div className="text-center mt-10">Loading Form...</div>;

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-lg mt-10 border-t-4 border-blue-600">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{form.title}</h1>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field, idx) => (
          <div key={idx} className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">{field.label}</label>
            <input
              type={field.fieldType}
              required={field.required}
              className="w-full border-gray-300 border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => handleChange(field.label, e.target.value)}
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormSubmit;