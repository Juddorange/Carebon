const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/profile', (req, res) => {
	User.findOne({ email: req.user.email })
		.then((dbRes) => {
			res.json(dbRes);
		})
		.catch((err) => console.log(err));
});

module.exports = router;
