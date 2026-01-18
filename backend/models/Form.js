const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  // FIX 1: Changed to String so it accepts the 'username' from your Frontend
  createdBy: { 
    type: String, 
    required: true 
  },
  fields: [
    {
      label: String,
      // FIX 2: Removed 'enum' restriction so 'radio', 'checkbox', 'select' work
      fieldType: { 
        type: String, 
        required: true 
      },
      required: { 
        type: Boolean, 
        default: false 
      },
      // FIX 3: Added options array so your choices are actually saved
      options: {
        type: [String],
        default: []
      }
    }
  ],
  submissions: [
    {
      submittedAt: { type: Date, default: Date.now },
      // Storing data as a flexible object is usually safer than Map for beginners
      data: { type: Object } 
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Form', FormSchema);