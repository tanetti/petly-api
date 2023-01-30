const fs = require("fs/promises");
const path = require("path");

const pathToFile = path.resolve("./mock/services.json");

const getServices = async (req, res, next) => {
  try {
    const data = await fs.readFile(pathToFile);

    const result = JSON.parse(data);

    res.json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ code: "api-services-error", message: "Data corrupted" });
  }
};

module.exports = getServices;
