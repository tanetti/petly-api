const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dnsiuzg5g',
  api_key: '488121945218736',
  api_secret: 'PXT433_ddDbzBoK3AHmtmgc9WC8',
});

const uploadCloudinary = async (imgPath, imgName) => {
  const res = await cloudinary.uploader.upload(imgPath, {
    public_id: `${imgName}`,
  });

  const url = res.secure_url;

  return url;
};

const deleteCloudinary = async imgName => {
  await cloudinary.api.delete_resources_by_prefix(imgName);
};

module.exports = { uploadCloudinary, deleteCloudinary };
