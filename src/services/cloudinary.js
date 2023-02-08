const cloudinary = require('cloudinary').v2;
const {
  USER_AVATAR,
  OWN_AVATAR,
  NOTICE_AVATAR,
} = require('../constants/cloudinaryOptionsPresets');

const generatePublicIId = require('../utilities/generatePublicId');

cloudinary.config({
  secure: true,
});

const uploadUserAvatarService = async imagePath => {
  const result = await cloudinary.uploader.upload(imagePath, USER_AVATAR);

  return result;
};

const uploadOwnAvatarService = async imagePath => {
  const result = await cloudinary.uploader.upload(imagePath, OWN_AVATAR);

  return result;
};

const uploadNoticeAvatarService = async imagePath => {
  const result = await cloudinary.uploader.upload(imagePath, NOTICE_AVATAR);

  return result;
};

const destroyAvatarByUrlService = async currentUrl => {
  await cloudinary.uploader.destroy(generatePublicIId(currentUrl));
};

module.exports = {
  uploadUserAvatarService,
  uploadOwnAvatarService,
  uploadNoticeAvatarService,
  destroyAvatarByUrlService,
};
