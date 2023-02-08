const generatePublicId = url => {
  const urlParts = url.split('/').reverse();
  const [fullFilename, avatarDir, rootDir] = urlParts;
  const [fileName] = fullFilename.split('.');

  return `${rootDir}/${avatarDir}/${fileName}`;
};

module.exports = generatePublicId;
