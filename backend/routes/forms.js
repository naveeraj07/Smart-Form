const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const auth = require('../middleware/auth');

// Create Form
router.post('/create', auth, async (req, res) => {
  try {
    const { title, fields } = req.body;
    const newForm = new Form({
      title,
      fields,
      createdBy: req.user.id
    });
    await newForm.save();
    res.json(newForm);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get User's Forms (For Dashboard)
router.get('/user/me', auth, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user.id });
    res.json(forms);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get Single Form (Public)
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ msg: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Submit Form (Public)
router.post('/submit/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    form.submissions.push({ data: req.body.data });
    await form.save();
    res.json({ msg: 'Form submitted successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;