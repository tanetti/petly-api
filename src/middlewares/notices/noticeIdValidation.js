const noticeIdValidation = (req, res, next) => {
  const { noticeId } = req.params;

  if (!String(noticeId)) {
    return res.status(400).json({
      message: 'Incorrect "noticeId", pleace input string !',
    });
  }

  next();
};

module.exports = noticeIdValidation;
