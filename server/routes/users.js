const router = require('express').Router();
const auth = require('../middleware/auth');
const { getMe, updateMe, savePushToken } = require('../controllers/userController');

// All user routes require a valid token.
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.put('/push-token', auth, savePushToken);

module.exports = router;
