const News = require('../models/news');

const listNews = async (req, res, next) => {
  const result = await News.find();

  res.json(result);
};

module.exports = listNews;
