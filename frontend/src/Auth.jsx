const handleSubmit = async (e) => {
  e.preventDefault();
  const url = isRegistering 
    ? 'http://localhost:5000/api/auth/register' 
    : 'http://localhost:5000/api/auth/login';

  try {
    const response = await axios.post(url, { username, password });
    
    // With Axios, check response.data for your token or user info
    onLogin(response.data); 
  } catch (err) {
    // Axios puts the server error message inside err.response.data
    setError(err.response?.data?.message || "Login failed");
  }
};