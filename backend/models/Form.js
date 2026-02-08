const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  
  description: { type: String }, // Good to have for Quiz instructions

  // 1️⃣ NEW: STORES IF IT IS A QUIZ OR NORMAL FORM
  formType: { 
    type: String, 
    enum: ['quiz', 'form'], 
    default: 'form' 
  },

  createdBy: { 
    type: String, 
    required: true 
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },

  themeColor: { 
    type: String, 
    default: "#2563EB" 
  }, 

  fields: [
    {
      label: String, // The Question Text
      fieldType: { 
        type: String, 
        required: true 
      },
      required: { 
        type: Boolean, 
        default: false 
      },
      options: {
        type: [String],
        default: []
      },

      // 2️⃣ NEW: QUIZ FIELDS (Only used if formType === 'quiz')
      correctAnswer: { type: String, default: '' }, // Stores the correct option
      marks: { type: Number, default: 0 },          // Stores points (e.g., 5)

      // EXISTING: CONDITIONAL LOGIC SUPPORT
      logic: {
        targetField: { type: String, default: "" }, 
        targetValue: { type: String, default: "" }, 
        action: { type: String, default: "show" }   
      }
    }
  ],

  submissions: [
    {
      submittedAt: { type: Date, default: Date.now },
      
      // 3️⃣ NEW: SAVE THE SCORE HERE
      score: { type: Number, default: 0 }, 
      
      data: { type: Object } 
    }
  ],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Form', FormSchema);