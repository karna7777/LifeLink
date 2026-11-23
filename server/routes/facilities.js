const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { createFacility, getFacility, updateFacility } = require('../controllers/facilityController');

router.post('/', auth, role('staff'), createFacility); // staff creates own facility
router.get('/:id', auth, getFacility); // any logged-in user can view
router.put('/:id', auth, role('staff'), updateFacility); // owner staff updates

module.exports = router;
