const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  
  // You are using String for createdBy, which matches your current Auth
  createdBy: { 
    type: String, 
    required: true 
  },
  
  // Also adding 'user' reference just in case you want to use strict ID linking later
  // (Optional, but good practice for the future)
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
      label: String,
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

      // ✨ NEW: CONDITIONAL LOGIC SUPPORT ✨
      logic: {
        targetField: { type: String, default: "" }, // The question that controls this one
        targetValue: { type: String, default: "" }, // The answer required to show this
        action: { type: String, default: "show" }   // Typically 'show'
      }
    }
  ],

  submissions: [
    {
      submittedAt: { type: Date, default: Date.now },
      data: { type: Object } 
    }
  ],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Form', FormSchema);