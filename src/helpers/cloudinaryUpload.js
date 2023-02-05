const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dnsiuzg5g',
  api_key: '488121945218736',
  api_secret: 'PXT433_ddDbzBoK3AHmtmgc9WC8',
});

const uploadCloudinary = (imgPath, imgName) => {
  cloudinary.uploader.upload(imgPath, {
    public_id: `${imgName}`,
  });

  const url = cloudinary.url(`${imgName}`, {
    width: 100,
    height: 150,
    Crop: 'fill',
  });

  return url;
};

module.exports = uploadCloudinary;
