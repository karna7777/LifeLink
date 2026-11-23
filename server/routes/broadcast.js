const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { broadcast } = require('../controllers/broadcastController');

router.post('/', auth, role('staff'), broadcast);

module.exports = router;
