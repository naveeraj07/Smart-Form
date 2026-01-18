const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create Form
router.post('/create', auth, async (req, res) => {
  try {
    console.log("📥 Received Form Data:", req.body); // DEBUGGING

    // We extract 'fields' (which includes options)
    const { title, fields } = req.body;

    // Validation
    if (!title || !fields) {
      return res.status(400).json({ msg: 'Please include title and fields' });
    }

    const newForm = new Form({
      title,
      // We explicitly pass fields to ensure options are included
      fields, 
      // We use the User ID from the token (Secure)
      createdBy: req.user.id 
    });

    const savedForm = await newForm.save();
    console.log("✅ Form Saved to DB:", savedForm); // CONFIRMATION
    res.json(savedForm);

  } catch (err) {
    console.error("❌ SAVE ERROR:", err.message); // READ THIS IN TERMINAL
    res.status(500).send('Server Error: ' + err.message);
  }
});

// Get User's Forms (Dashboard)
router.get('/user/me', auth, async (req, res) => {
  try {
    // 1. First, get the user's details to find their username
    const user = await User.findById(req.user.id);

    // 2. Find forms created by their ID *OR* their Username
    const forms = await Form.find({ 
      $or: [
        { createdBy: req.user.id },     // Matches New Forms
        { createdBy: user.username }    // Matches Old Forms
      ]
    }).sort({ createdAt: -1 });

    res.json(forms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Single Form (Public - for filling out)
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ msg: 'Form not found' });
    res.json(form);
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') return res.status(404).json({ msg: 'Form not found' });
    res.status(500).send('Server Error');
  }
});

// Submit Form Response (Public)
router.post('/submit/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ msg: 'Form not found' });

    // Push the submitted data into the submissions array
    form.submissions.push({
      data: req.body.data // This expects { "Question": "Answer" }
    });

    await form.save();
    res.json({ msg: 'Form submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.get('/debug/all', async (req, res) => {
  try {
    const allForms = await Form.find({});
    res.json(allForms);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;