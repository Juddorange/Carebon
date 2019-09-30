const express = require('express');
const router = express.Router();
const User = require('../models/User');
const uploader = require('./../configs/cloudinary');
const bcrypt = require('bcrypt');

router.get('/profile', (req, res) => {
	User.findOne({ email: req.user.email })
		.then((dbRes) => {
			res.json(dbRes);
		})
		.catch((err) => console.log(err));
});

router.put('/profile/update', (req, res) => {
	let picture = null;
	if (req.file) picture.file;
	const { name, email } = req.body;
	console.log(req.body);
	if (name) {
		User.findOneAndUpdate({ email: req.user.email }, { name }, { new: true })
			.then((dbRes) => res.json(dbRes))
			.catch((err) => console.log(err));
	}
	if (email) {
		User.findOneAndUpdate({ email: req.user.email }, { email }, { new: true })
			.then((dbRes) => res.json(dbRes))
			.catch((err) => console.log(err));
	}
});

router.put('/profile/updatePicture', uploader.single('picture'), (req, res) => {
	if (req.file) console.log(req.file.secure_url);
	User.findOneAndUpdate({ email: req.user.email }, { picture: req.file.secure_url }, { new: true })
		.then((dbRes) => res.json(dbRes))
		.catch((err) => console.log(err));
});

router.delete('/profile/deleteAccount', (req, res) => {
	User.findOneAndRemove({ email: req.user.email }).then((dbRes) => res.json(dbRes)).catch((err) => console.log(err));
});

module.exports = router;
