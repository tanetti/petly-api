const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const app = express();

const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news');
const servicesRouter = require('./routes/services');
const noticesRouter = require('./routes/notices');

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/news', newsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/notices', noticesRouter);

app.use((req, res) => {
  res.status(404).json({ code: 'not-found', message: "Path wasn't found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ code: 'api-error', message: err.message });
});

module.exports = app;
