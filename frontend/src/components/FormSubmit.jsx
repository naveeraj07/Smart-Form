import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FormSubmit = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      const res = await axios.get(`http://localhost:5000/api/forms/${id}`);
      setForm(res.data);
    };
    fetchForm();
  }, [id]);

  const handleChange = (label, value) => {
    setFormData({ ...formData, [label]: value });
  };

  const handleCheckbox = (label, value) => {
    const prev = formData[label] || [];
    setFormData({
      ...formData,
      [label]: prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      `http://localhost:5000/api/forms/submit/${id}`,
      { data: formData }
    );
    alert('Form submitted!');
    setFormData({});
  };

  if (!form) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6">{form.title}</h1>

      <form onSubmit={handleSubmit}>
        {form.fields.map((field, idx) => (
          <div key={idx} className="mb-5">
            <label className="block font-medium mb-2">
              {field.label}
            </label>

            {['text', 'email', 'number'].includes(field.fieldType) && (
              <input
                type={field.fieldType}
                required={field.required}
                className="w-full border p-3 rounded"
                onChange={(e) =>
                  handleChange(field.label, e.target.value)
                }
              />
            )}

            {field.fieldType === 'textarea' && (
              <textarea
                className="w-full border p-3 rounded"
                required={field.required}
                onChange={(e) =>
                  handleChange(field.label, e.target.value)
                }
              />
            )}

            {field.fieldType === 'radio' &&
              field.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={field.label}
                    value={opt}
                    required={field.required}
                    onChange={(e) =>
                      handleChange(field.label, e.target.value)
                    }
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}

            {field.fieldType === 'checkbox' &&
              field.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="checkbox"
                    value={opt}
                    onChange={() =>
                      handleCheckbox(field.label, opt)
                    }
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}

            {field.fieldType === 'select' && (
              <select
                className="w-full border p-3 rounded"
                required={field.required}
                onChange={(e) =>
                  handleChange(field.label, e.target.value)
                }
              >
                <option value="">Select</option>
                {field.options.map((opt, i) => (
                  <option key={i}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-bold"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormSubmit;
