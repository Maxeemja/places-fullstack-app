const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
	getPlaceById,
	getPlacesByUserId,
	createPlace,
	getPlaces,
	updatePlace,
	deletePlace
} = require('../controllers/places-controller');
const checkAuth = require('../middleware/check-auth');

router.get('/', getPlaces);

router.get('/:pid', getPlaceById);

router.use(checkAuth);

router.get('/user/:uid', getPlacesByUserId);

router.post('/', createPlace);

router.patch(
	'/:pid',
	check(['title', 'description']).not().isEmpty(),
	check('description').isLength({ min: 5 }),
	updatePlace
);

router.delete('/:pid', deletePlace);

module.exports = router;
