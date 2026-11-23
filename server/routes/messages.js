const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getMessages, sendMessage } = require('../controllers/messageController');

router.get('/:requestId', auth, getMessages);
router.post('/:requestId', auth, upload.single('image'), sendMessage);

module.exports = router;
