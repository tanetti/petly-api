const app = require('./src/app');
const { dbConnection } = require('./src/services/dbConnection');
require('dotenv').config();

const dbConnectionUrl = process.env.DB_CONNECTION_URL;
const appPort = process.env.PORT || 8822;

const startServer = async (dbConnectionUrl, appPort) => {
  await dbConnection(dbConnectionUrl);

  app.listen(appPort, () => {
    console.log(`\x1b[34mServer running. API running on port: ${appPort}`);
  });
};

console.log('Petly starting...');

startServer(dbConnectionUrl, appPort);
