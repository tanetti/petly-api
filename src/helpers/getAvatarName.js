const getAvatarName = url => {
  const urlArr = url.split('/');
  const imgName = urlArr.pop();
  const originalFileArr = imgName.split('.');
  const originalFilename = originalFileArr.shift();
  //   console.log(originalFilename.typeOf);

  return originalFilename;
};

module.exports = getAvatarName;
