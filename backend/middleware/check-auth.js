const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			throw new Error('Authentication failed s');
		}
		const decodedToken = jwt.verify(token, 'supersecret');
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (err) {
		const error = new HttpError('Authentication failed', 401);
		return next(error);
	}
};
