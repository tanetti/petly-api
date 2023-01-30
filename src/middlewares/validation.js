const Validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            console.error(error);
            console.log(error)
            next(error);
        }
        next();
    };
};




module.exports = {
    Validate,
};