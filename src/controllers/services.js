const path = require('path');
const fs = require('fs/promises');

const pathToFile = path.resolve('./mock/services.json');

const getServicesController = async (req, res) => {
  try {
    const data = await fs.readFile(pathToFile);

    const result = JSON.parse(data);

    res.json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ code: 'api-services-error', message: 'Data corrupted' });
  }
};

module.exports = getServicesController;
