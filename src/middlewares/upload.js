const multer = require('multer');
const path = require('path');

const tempDir = path.resolve('./tmp');

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const { _id } = req.user;
    const currentUserId = _id.toString();
    const [, extension] = file.originalname.split('.');

    cb(null, `${currentUserId}.${extension}`);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: multerConfig,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      return cb(new Error('Avatar must be a JPEG or PNG file'));
    }

    cb(null, true);
  },
});

module.exports = upload;
