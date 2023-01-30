const { Pet } = require("../models/pets");

const addPet = async(req, res, next) => {
    const { name, date, breed, comments } = req.body;
    const { id } = req.params;

    const addCard = async(owner, name, date, breed, comments) => {
        const pet = new Pet({ owner, name, date, breed, comments });
        await pet.save();
    };

    try {
        await addCard(id, name, date, breed, comments);
        res.status(200).json({
            status: "created",
            message: "Your pet was added",
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const deletePet = async(req, res, next) => {
    const { id } = req.query;
    console.log(id);

    try {
        await Pet.findByIdAndDelete(id);
        res.status(200).json({
            status: "deleted",
            message: `Your pet number ${id} was deleted`,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports = {
    addPet,
    deletePet,
};