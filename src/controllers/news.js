const path = require('path');
const fs = require('fs/promises');
const sortByDate = require('../utilities/sortByDate');

const pathToFile = path.resolve('./mock/news.json');

const getNewsController = async (req, res) => {
  const { search = '' } = req.query;

  try {
    const data = await fs.readFile(pathToFile);

    const rawData = JSON.parse(data);

    let filteredData = null;

    if (search) {
      const normalizedSearchValue = search.toLowerCase();

      filteredData = rawData.filter(
        ({ title, description }) =>
          title.toLowerCase().includes(normalizedSearchValue) ||
          description.toLowerCase().includes(normalizedSearchValue)
      );
    } else {
      filteredData = rawData;
    }

    const result = sortByDate(filteredData);

    res.json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ code: 'api-news-error', message: 'Data corrupted' });
  }
};

module.exports = getNewsController;
