import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios';

const FormSubmit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Handle Text/Radio inputs
  const handleChange = (label, value) => {
    setFormData({ ...formData, [label]: value });
  };

  // Handle Checkbox inputs (Arrays)
  const handleCheckbox = (label, value) => {
    const currentList = formData[label] || [];
    if (currentList.includes(value)) {
      // If already selected, remove it
      setFormData({ 
        ...formData, 
        [label]: currentList.filter((v) => v !== value) 
      });
    } else {
      // If not selected, add it
      setFormData({ 
        ...formData, 
        [label]: [...currentList, value] 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // CUSTOM VALIDATION FOR CHECKBOXES
    // HTML 'required' on checkboxes is buggy, so we check manually
    for (const field of form.fields) {
      if (field.required && field.fieldType === 'checkbox') {
        const answers = formData[field.label] || [];
        if (answers.length === 0) {
          alert(`Please select at least one option for: ${field.label}`);
          return; // Stop submission
        }
      }
    }

    try {
      await axios.post(`http://localhost:5000/api/forms/submit/${id}`, { data: formData });
      alert('Form submitted successfully!');
      navigate('/dashboard'); // Or show a "Thank You" screen
    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  if (!form) return <div className="text-center mt-10">Loading Form...</div>;

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-lg mt-10 border-t-4 border-blue-600">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{form.title}</h1>
      <p className="text-gray-500 mb-6 text-sm">Please fill out the details below.</p>

      <form onSubmit={handleSubmit}>
        {form.fields.map((field, idx) => (
          <div key={idx} className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {/* TEXT / EMAIL / NUMBER */}
            {['text', 'email', 'number', 'textarea'].includes(field.fieldType) && (
              field.fieldType === 'textarea' ? (
                <textarea
                  className="w-full border p-3 rounded focus:outline-blue-500 bg-gray-50"
                  required={field.required}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              ) : (
                <input
                  type={field.fieldType}
                  className="w-full border p-3 rounded focus:outline-blue-500 bg-gray-50"
                  required={field.required}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              )
            )}

            {/* SINGLE CHOICE (Radio) */}
            {field.fieldType === 'radio' && (
              <div className="space-y-2">
                {field.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                    <input
                      type="radio"
                      name={field.label} // Keeps them in one group
                      value={opt}
                      required={field.required}
                      className="w-5 h-5 text-blue-600"
                      onChange={(e) => handleChange(field.label, e.target.value)}
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* MULTIPLE CHOICE (Checkbox) */}
            {field.fieldType === 'checkbox' && (
              <div className="space-y-2">
                {field.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      value={opt}
                      // Note: We do NOT put 'required' here, we handle it in handleSubmit
                      className="w-5 h-5 text-blue-600 rounded"
                      onChange={() => handleCheckbox(field.label, opt)}
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold text-lg transition shadow-md"
        >
          Submit Response
        </button>
      </form>
    </div>
  );
};

export default FormSubmit;