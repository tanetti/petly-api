const getAvatarName = url => {
  const urlArr = url.split('/');
  const imgName = urlArr.pop();
  const originalFileArr = imgName.split('.');
  const originalFilename = originalFileArr.shift();

  return originalFilename;
};

module.exports = getAvatarName;
