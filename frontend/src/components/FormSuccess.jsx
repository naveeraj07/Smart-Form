import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const FormSuccess = () => {
  const location = useLocation();
  const { isQuiz, score, total, title } = location.state || {};
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Calculate percentage for circle stroke (approx)
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  // Dynamic Color based on score
  const getScoreColor = () => {
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const scoreColor = getScoreColor();

  return (
    // 🌟 FULL PAGE WRAPPER
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 relative overflow-hidden text-white">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* 🌟 GLASS CARD */}
      <div className={`relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl text-center max-w-md w-full transform transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* SUCCESS ICON */}
        <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce-slow">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Response Recorded!
        </h1>
        
        <p className="text-gray-400 mb-8 text-lg">
          {title ? `You have successfully submitted "${title}".` : "Your response has been saved securely."}
        </p>

        {/* 🏆 QUIZ SCORE SECTION */}
        {isQuiz && (
           <div className="mb-8 p-6 rounded-2xl bg-black/30 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
              
              <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Your Score</h2>
              <div className="flex items-end justify-center gap-2">
                 <span className="text-5xl font-black" style={{ color: scoreColor, textShadow: `0 0 20px ${scoreColor}66` }}>
                    {score}
                 </span>
                 <span className="text-2xl text-gray-500 font-medium mb-1">/ {total}</span>
              </div>
              
              <div className="mt-4 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                 <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%`, backgroundColor: scoreColor, boxShadow: `0 0 10px ${scoreColor}` }}
                 />
              </div>
              
              <p className="mt-3 text-sm" style={{ color: scoreColor }}>
                 {percentage >= 80 ? "🎉 Excellent Work!" : percentage >= 50 ? "👍 Good Job!" : "📚 Keep Studying!"}
              </p>
           </div>
        )}

        {/* ACTION BUTTON */}
        <Link 
          to="/" 
          className="block w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25 border border-white/10"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
        >
          Create Your Own Form →
        </Link>
        
        <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-500">
                Powered by <span className="font-semibold text-gray-300">FormAI</span>
            </p>
        </div>

      </div>
    </div>
  );
};

export default FormSuccess;