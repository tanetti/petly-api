const Notice = require('../models/notices');

const addNoticeService = async data => {
  const notice = new Notice(data);

  const result = await notice.save();

  return result;
};

const updateNoticeByIdService = async (_id, body) => {
  await Notice.findByIdAndUpdate(_id, body);
};

module.exports = {
  addNoticeService,
  updateNoticeByIdService,
};
