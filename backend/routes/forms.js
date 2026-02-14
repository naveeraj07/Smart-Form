const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/forms/create
// @desc    Create a new form OR Quiz
router.post('/create', auth, async (req, res) => {
  try {
    // 1. EXTRACT 'formType' along with other fields
    const { title, fields, themeColor, formType } = req.body;

    if (!title || !fields) {
      return res.status(400).json({ msg: 'Please include title and fields' });
    }

    const newForm = new Form({
      title,
      fields,
      themeColor: themeColor || '#2563EB',
      formType: formType || 'form', // <--- 2. SAVE FORM TYPE (Important for Quizzes)
      createdBy: req.user.id,       // Using 'createdBy' to match your schema
      user: req.user.id             // Saving 'user' too just in case your Schema uses it
    });

    const savedForm = await newForm.save();
    res.json(savedForm);

  } catch (err) {
    console.error("❌ SAVE ERROR:", err.message);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// @route   GET api/forms/my-forms
// @desc    Get User's Forms (Dashboard)
router.get('/my-forms', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Keep your smart logic that checks both ID and Username
    const forms = await Form.find({ 
      $or: [
        { createdBy: req.user.id },
        { createdBy: user.username },
        { user: req.user.id } 
      ]
    }).sort({ createdAt: -1 });

    res.json(forms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/forms/:id
// @desc    Get Single Form (Public - for filling out)
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

// @route   POST api/forms/submit/:id
// @desc    Submit Form Response (Public)
router.post('/submit/:id', async (req, res) => {
  try {
    // 3. EXTRACT SCORE & DATA
    const { data, score } = req.body; 

    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ msg: 'Form not found' });

    form.submissions.push({
      data: data,
      score: score || 0, // <--- 4. SAVE SCORE (Default to 0 if missing)
      submittedAt: new Date()
    });

    await form.save();
    res.json({ msg: 'Form submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 🗑️ NEW DELETE ROUTE
// @route   DELETE api/forms/:id
// @desc    Delete a form (Only the creator can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ msg: 'Form not found' });
    }

    // Check if the user deleting it is the one who created it
    // We check both 'createdBy' and 'user' fields to be safe
    if (form.createdBy.toString() !== req.user.id && form.user?.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await form.deleteOne(); // Deletes the form
    res.json({ msg: 'Form removed' });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Form not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Debug Route (Optional)
router.get('/debug/all', async (req, res) => {
  try {
    const allForms = await Form.find({});
    res.json(allForms);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;