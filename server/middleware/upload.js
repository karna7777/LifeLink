const multer = require('multer');
const path = require('path');

// Saves uploaded images into the /server/uploads folder with a unique filename.
// Used for prescription photos (and chat images in Phase 7).
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // keep the original extension
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
