const path = require('path');

const createNewImagePath = (oldPath, newFilename) => {
  const tempDirectory = path.resolve('./tmp');

  const [extension] = oldPath.split('.').reverse();

  return `${tempDirectory}\\${newFilename}.${extension}`;
};

module.exports = createNewImagePath;
