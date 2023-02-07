const Notice = require('../models/notice');

const findSortedByDateCategoryNoticesService = async (category, search) => {
  let result = null;

  if (!search) {
    result = await Notice.find(category === 'all' ? null : { category })
      .populate('owner', '_id email phone')
      .sort({ created_at: 'desc' });
  } else {
    result = await Notice.find(category === 'all' ? null : { category })
      .or([
        { title: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ])
      .populate('owner', '_id email phone')
      .sort({ created_at: 'desc' });
  }

  return result;
};

const findSortedByDateUserOwnNoticesService = async (owner, search) => {
  let result = null;

  if (!search) {
    result = await Notice.find({ owner })
      .populate('owner', '_id email phone')
      .sort({ created_at: 'desc' });
  } else {
    result = await Notice.find({ owner })
      .or([
        { title: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ])
      .populate('owner', '_id email phone')
      .sort({ created_at: 'desc' });
  }

  return result;
};

const findSortedByDateUserFavotiteNoticesService = async (
  userFavoriteNotices,
  search
) => {
  let result = null;

  if (!search) {
    result = await Notice.find({ _id: { $in: userFavoriteNotices } })
      .populate('owner', '_id email phone')
      .sort({ created_at: 'desc' });
  } else {
    result = await Notice.find({ _id: { $in: userFavoriteNotices } })
      .or([
        { title: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ])
      .populate('owner', '_id email phone')
      .sort({ created_at: 'desc' });
  }

  return result;
};

const getNoticeByIdService = async _id => {
  const result = await Notice.findById(_id).populate(
    'owner',
    '_id email phone'
  );

  return result;
};

const addNoticeService = async data => {
  const notice = new Notice(data);

  const result = await notice.save();

  return result;
};

const updateNoticeByIdService = async (_id, body) => {
  await Notice.findByIdAndUpdate(_id, body);
};

const deleteNoticeByParametersService = async parameters => {
  await Notice.findOneAndDelete(parameters);
};

module.exports = {
  findSortedByDateCategoryNoticesService,
  findSortedByDateUserOwnNoticesService,
  findSortedByDateUserFavotiteNoticesService,
  getNoticeByIdService,
  addNoticeService,
  updateNoticeByIdService,
  deleteNoticeByParametersService,
};
