const path = require("path");
const fs = require("fs/promises");


const pathToFile = path.join(__dirname, '../mock/news.json');

const listNews = async (req, res, next) => {
    const data = await fs.readFile(pathToFile);
     const result = JSON.parse(data);
  res.json(result);
};

module.exports = listNews;
