const path = require('path');
const fs = require('fs/promises');

const pathToFile = path.resolve('./mock/news.json');

const getNewsController = async (req, res, next) => {
  try {
    const data = await fs.readFile(pathToFile);

    const result = JSON.parse(data);

    res.json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ code: 'api-news-error', message: 'Data corrupted' });
  }
};

module.exports = getNewsController;
