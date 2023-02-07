const filterData = (data, filter, fields) => {
  if (!data) return;
  if (!filter || !fields) return data;

  const normalizedFilterValue = filter.toLowerCase();

  const filteredData = data.filter(datum => {
    let isMatch = false;

    fields.forEach(field => {
      if (datum[field].toLowerCase().includes(normalizedFilterValue))
        isMatch = true;
    });

    return isMatch;
  });

  return filteredData;
};

module.exports = filterData;
