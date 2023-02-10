const cloudinary = require('cloudinary').v2;
const UPLOAD_PRESETS = require('../constants/uploadPresets');
const generatePublicIId = require('../utilities/generatePublicId');

cloudinary.config({
  secure: true,
});

const uploadAvatar = async (imagePath, fieldName) => {
  const uploadPreset = UPLOAD_PRESETS[fieldName] ?? UPLOAD_PRESETS.unspecified;
  console.log(fieldName);
  const result = await cloudinary.uploader.upload(imagePath, uploadPreset);

  return result;
};

const destroyAvatarByUrl = async currentUrl => {
  await cloudinary.uploader.destroy(generatePublicIId(currentUrl));
};

module.exports = {
  uploadAvatar,
  destroyAvatarByUrl,
};
