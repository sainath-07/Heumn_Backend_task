const CustomErrors = require("./customErrors");

const restrictUser = (checkRole) => {
    return (req, res, next) => {
        if (req.user.role !== checkRole) {
            const error = new CustomErrors(
                "You do not have permission for this action",
                401
            );
            return next(error);
        }
        next();
    };
}

module.exports=restrictUser