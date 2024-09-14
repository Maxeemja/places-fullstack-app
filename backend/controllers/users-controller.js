const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, '-password');
	} catch (e) {
		return next(new HttpError('Fetching users failed', 500));
	}

	res.json({ users: users });
};
const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (errors.errors.length) {
		console.log(errors);
		return next(new HttpError('Invalid inputs passed', 422));
	}

	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (e) {
		return next(new HttpError('Signing up failed', 500));
	}

	if (existingUser) {
		return next(new HttpError('User already exists', 401));
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (error) {
		const err = new HttpError(error.message, 500);
		return next(err);
	}

	const createdUser = new User({
		name,
		email,
		password: hashedPassword,
		image:
			'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
		places: []
	});

	try {
		await createdUser.save();
	} catch (e) {
		return next(new HttpError('Signing up failed', 500));
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			'supersecret',
			{ expiresIn: '24h' }
		);
	} catch (error) {
		return next(new HttpError(error.message, 500));
	}

	res
		.status(201)
		.json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;
	const existingUser = await User.findOne({ email: email });

	if (!existingUser) {
		return next(new HttpError('User not exist', 500));
	}

	if (existingUser && existingUser.password !== password) {
		return next(new HttpError('Wrong password', 401));
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (error) {
		return next(new HttpError('Could not log you in, check creds', 500));
	}

	if (!isValidPassword) {
		return next(new HttpError('Invalid password', 401));
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			'supersecret',
			{ expiresIn: '24h' }
		);
	} catch (error) {
		return next(new HttpError(error.message, 500));
	}

	res.json({
		userId: existingUser.id,
		email: existingUser.email,
		token: token
	});
};

module.exports = { getUsers, signup, login };
