const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbConnection = async (dbConnectionUrl) => {
  if (!dbConnectionUrl) {
    console.error("\x1B[31mDatabase connection ULR was not specified");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbConnectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("\x1b[32mDatabase connection successful");
  } catch (error) {
    console.error(`\x1B[31mDatabase connection error: '${error.message}'`);
    process.exit(1);
  }
};

module.exports = { dbConnection };
