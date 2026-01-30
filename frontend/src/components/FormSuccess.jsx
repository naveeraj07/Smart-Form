import { Link } from 'react-router-dom';

const FormSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border-t-8 border-green-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Response Recorded!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for filling out the form. Your response has been saved securely.
        </p>

        <Link 
          to="/" 
          className="block w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg"
        >
          Create Your Own Form
        </Link>
      </div>
    </div>
  );
};

export default FormSuccess;