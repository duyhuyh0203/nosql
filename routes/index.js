const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const sanitize = require('mongo-sanitize');


router.get('/', (req, res) => {
	return res.render('index');
});

router.post('/api/login', (req, res) => {
	let { username, password } = sanitize(req.body);
	if (username && password) {
		return User.find({ 
			username,
		})
			.then((user) => {
				if (user[0].password == password) {
					return res.json({logged: 1, message: `Login Successful, welcome back ${user[0].username}.` });
				} else {
					return res.json({logged: 0, message: 'Login Failed'});
				}
			})
			.catch(() => {
				res.json({ message: 'Something went wrong'});
			})
	}
	return res.json({ message: 'Invalid username or password'});
});

module.exports = router;
