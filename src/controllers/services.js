const path = require('path');
const fs = require('fs/promises');

const pathToMockFile = path.resolve('./mock/services.json');

const getServices = async (req, res) => {
  try {
    const data = await fs.readFile(pathToMockFile);

    const result = JSON.parse(data);

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: 'api-services-error' });
  }
};

module.exports = getServices;
