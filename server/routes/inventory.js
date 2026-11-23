const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { listMine, addItem, updateItem, deleteItem } = require('../controllers/inventoryController');

// All inventory routes are staff-only and scoped to the staff member's facility.
router.get('/', auth, role('staff'), listMine);
router.post('/', auth, role('staff'), addItem);
router.put('/:id', auth, role('staff'), updateItem);
router.delete('/:id', auth, role('staff'), deleteItem);

module.exports = router;
