const sortByDate = data =>
  data.sort((a, b) => new Date(b?.date) - new Date(a?.date));

module.exports = sortByDate;
