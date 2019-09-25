const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/profile', (req, res) => {
	res.json(res);
});
