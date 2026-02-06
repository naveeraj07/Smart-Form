const handleSubmit = async (e) => {
  e.preventDefault();

  // 1. Define the Base URL
  // If we are on Vercel, this grabs the Render URL. If on your laptop, it uses localhost.
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // 2. Decide if it is Login or Register
  const endpoint = isRegistering ? '/auth/register' : '/auth/login';

  try {
    // 3. Make the request using the dynamic URL
    const response = await axios.post(`${API_URL}${endpoint}`, { username, password });
    
    // Success!
    onLogin(response.data); 
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};