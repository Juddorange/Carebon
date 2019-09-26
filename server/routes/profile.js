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

router.post('/profile/edit/:id/name', (req, res) => {
	const name = req.body.name;
	infoUser
		.findByIdAndUpdate(req.params.id, { name: name })
		.then((dbRes) => res.redirect('/profile'))
		.catch((err) => console.log(err));
});

router.post('/profile/edit/:id/email', (req, res) => {
	const email = req.body.email;
	infoUser
		.findOne({ email: email })
		.then((dbRes) => {
			if (!dbRes) {
				infoUser
					.findByIdAndUpdate(req.params.id, { email: email })
					.then((dbRes) => {
						req.user.email = email;
						res.redirect('/profile');
					})
					.catch((err) => console.log(err));
			} else {
				profile(res, req.params.id, 'this email is already used');
			}
		})
		.catch((err) => console.log(err));
});

router.post('/profile/edit/:id/password', (req, res) => {
	var password = req.body.password;
	const salt = bcrypt.genSaltSync(10);
	const hashed = bcrypt.hashSync(password, salt);
	password = hashed;
	infoUser
		.findByIdAndUpdate(req.params.id, { password: password })
		.then((dbRes) => {
			req.user.password = password;
			res.redirect('/profile');
		})
		.catch((err) => console.log(err));
});

router.post('/profile/edit/:id/avatar', uploader.single('avatar'), (req, res) => {
	if (req.file) {
		var avatar = req.file.secure_url;
	}
	infoUser
		.findByIdAndUpdate(req.params.id, { avatar: avatar })
		.then((dbRes) => res.redirect('/profile'))
		.catch((err) => console.log(err));
});

/*delete account*/
router.post('/profile/:id/delete', (req, res) => {
	infoUser.findByIdAndDelete(req.params.id).then((dbRes) => res.redirect('/logout')).catch((err) => console.log(err));
});

module.exports = router;
