const {User} = require('../../models');

const logoutUserController = async(req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, {token: null})
        res.status(204).json()
    } catch (error) {
        return res
        .status(400)
        .json({ code: "logout-error", message: error.message });
    }
}

module.exports = logoutUserController;

