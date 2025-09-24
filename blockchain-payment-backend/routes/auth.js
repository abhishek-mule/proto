const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
  res.json({ message: 'Registration endpoint working' });
});

module.exports = router;
