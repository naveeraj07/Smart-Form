import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import FormBuilder from './components/FormBuilder';
import FormSubmit from './components/FormSubmit';
import Dashboard from './components/DashBoard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/form/create" element={<FormBuilder />} />
          <Route path="/form/:id" element={<FormSubmit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;