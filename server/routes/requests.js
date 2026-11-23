const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');
const { createRequest, myRequests, incoming, getRequest, updateStatus } = require('../controllers/requestController');

// Create a request with an optional prescription image (field name "prescription").
router.post('/', auth, role('user'), upload.single('prescription'), createRequest);

// Specific routes must come before the "/:id" route.
router.get('/mine', auth, role('user'), myRequests);
router.get('/incoming', auth, role('staff'), incoming);

router.get('/:id', auth, getRequest);
router.put('/:id/status', auth, updateStatus);

module.exports = router;
