const path = require('path');
const fs = require('fs/promises');
const sortByDate = require('../utilities/sortByDate');
const filterData = require('../utilities/filterResult');

const pathToFile = path.resolve('./mock/news.json');

const getNewsController = async (req, res) => {
  const { search = '' } = req.query;

  try {
    const data = await fs.readFile(pathToFile);

    const rawData = JSON.parse(data);

    const filteredData = filterData(rawData, search, ['title', 'description']);

    const result = sortByDate(filteredData);

    res.json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ code: 'api-news-error', message: 'Data corrupted' });
  }
};

module.exports = getNewsController;
