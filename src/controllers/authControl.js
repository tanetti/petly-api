const { User } = require("../models/user");
const { Pet } = require("../models/pets");

const Register = async(req, res, next) => {
    const { email, password, name, location, number } = req.body;
    /*
        const avatarLink = gravatar.profile_url(email);
        const verificationToken = nanoid()
*/

    const registration = async(email, password, name, location, number) => {
        const user = new User({ email, password, name, location, number });
        await user.save();
    };

    const newEmail = await User.findOne({ email });

    if (!newEmail) {
        await registration(email, password, name, location, number);

        res.status(201).json({
            status: "Created",
            ResponseBody: {
                user: {
                    email: `${email}`,
                    subscription: "starter",
                },
            },
        });
    } else {
        res.status(409).json({
            status: "Conflict",
            ResponseBody: {
                message: "Email in use",
            },
        });
    }
    next();
};

const updateUserData = async(req, res, next) => {
    const { id } = req.params;
    const { email, name, location, number } = req.body;

    try {
        if (id) {
            const updatedUser = await User.findByIdAndUpdate(
                id, { email: email, name: name, location: location, number: number }, { new: true }
            );
            res.status(200).json({
                status: "success",
                code: 200,
                data: updatedUser,
            });
            console.log(updatedUser);
        } else {
            res.status(404).json({
                status: "error",
                code: 404,
                data: "not found",
                message: `There's no contact by ${id}`,
            });
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
};

const getUserData = async(req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        const pets = await Pet.find({ owner: id });

        res.status(200).json({
            status: "Success",
            data: {
                user: user,
                pets: pets,
            },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports = {
    Register,
    updateUserData,
    getUserData,
};