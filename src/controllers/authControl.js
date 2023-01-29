const { User } = require("../models/user");

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


module.exports = {
    Register,
   
};