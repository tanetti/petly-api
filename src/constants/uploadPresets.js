const UPLOAD_PRESETS = {
  user_avatar: {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: 'petly_api/user_avatars',
  },

  pet_avatar: {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: 'petly_api/pet_avatars',
  },

  notice_avatar: {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: 'petly_api/notice_avatars',
  },

  unspecified: {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: 'petly_api/unspecified',
  },
};

module.exports = UPLOAD_PRESETS;
