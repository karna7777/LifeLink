const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { search } = require('../controllers/searchController');

// Patients search for nearby stock.
router.get('/', auth, role('user'), search);

module.exports = router;
