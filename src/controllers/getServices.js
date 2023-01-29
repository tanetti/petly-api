const services = require("../models/ourFriends/services");

const getServices = async (req, res, next) => {
  const result = await services.listServices();

  res.json(result);
};

module.exports = getServices;
