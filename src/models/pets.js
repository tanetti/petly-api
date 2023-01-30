const mongoose = require("mongoose");
const Joi = require("joi");

const pet = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Enter your pet's name"],
        min: [2, "At least 2 characters"],
        max: 16,
    },

    date: {
        type: String,
        required: [true, "Enter date"],
        min: [6],
    },
    breed: {
        type: String,
        required: [true, "Enter your pet's breed"],
        min: [2, "At least 2 characters"],
        max: 16,
    },
    comments: {
        type: String,
        required: true,
        min: [8, "At least 8 characters"],
        max: 120,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
});

const petSchema = Joi.object({
    name: Joi.string().min(2).max(16).required(),
    date: Joi.string().min(6).max(16).required(),
    breed: Joi.string().min(2).required(),
    comments: Joi.string().min(8).max(120).required(),
});

const Pet = mongoose.model("pets", pet);

module.exports = {
    Pet,
    petSchema,
};