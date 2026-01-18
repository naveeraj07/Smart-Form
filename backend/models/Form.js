// backend/models/Form.js
const FormSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  // Does it have an array for the questions?
  inputs: [
    {
      label: String,   // e.g., "What is your name?"
      type: String,    // e.g., "text", "number", "email"
      placeholder: String
    }
  ],
  date: { type: Date, default: Date.now }
});