const express = require('express');
const router = new express.Router();

const upload = require('../middlewares/uploadImage');
const compressImage = require('../middlewares/compressImage');
const authHeaderValidation = require('../middlewares/authHeaderValidation');
const petIdParameterValidation = require('../middlewares/idRequestParameterValidation/petIdParameterValidation');
const petBodyValidation = require('../middlewares/petBodyValidation/validation');

const { getPet, addPet, deletePet } = require('../controllers/pets');

router.get('/', authHeaderValidation, getPet);
router.post(
  '/',
  authHeaderValidation,
  upload.single('pet_avatar'),
  compressImage,
  petBodyValidation,
  addPet
);
router.delete(
  '/:petId',
  authHeaderValidation,
  petIdParameterValidation,
  deletePet
);

module.exports = router;
