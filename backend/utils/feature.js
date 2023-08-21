import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, mxAge, statusCode = 200) => {
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        maxAge: mxAge,
    }).json({
        success: true,
        message,
        token:token,
        id:user._id,
        name:user.username
    });
}