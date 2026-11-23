const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { listFacilities, verifyFacility, stats } = require('../controllers/adminController');

// All admin routes require a logged-in admin.
router.get('/facilities', auth, role('admin'), listFacilities);
router.put('/facilities/:id/verify', auth, role('admin'), verifyFacility);
router.get('/stats', auth, role('admin'), stats);

module.exports = router;
