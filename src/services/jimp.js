const jimp = require('jimp');
const fs = require('fs/promises');

const resizeAndCompressImageService = async imagePath => {
  const [resultAvatarPath] = imagePath.split('@');

  const tempAvatar = await jimp.read(imagePath);

  const width = tempAvatar.getWidth();
  const height = tempAvatar.getHeight();
  const isHorizontal = width > height;
  const ratio = isHorizontal ? width / height : height / width;
  const newWidth = isHorizontal ? 500 * ratio : 500;
  const newHeight = isHorizontal ? 500 : 500 * ratio;

  await tempAvatar
    .resize(newWidth, newHeight)
    .quality(80)
    .writeAsync(resultAvatarPath);

  await fs.unlink(imagePath);

  return resultAvatarPath;
};

module.exports = resizeAndCompressImageService;
