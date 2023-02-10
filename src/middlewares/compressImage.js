const resizeAndCompressImageService = require('../services/jimp');

const compressImage = async (req, res, next) => {
  const { fieldname, path } = req.file;

  try {
    const compressedImagePath = await resizeAndCompressImageService(path);

    req.compressedImagePath = compressedImagePath;
    req.fieldName = fieldname;
  } catch (error) {
    return res.status(500).json({
      code: error.message,
    });
  }

  next();
};

module.exports = compressImage;
