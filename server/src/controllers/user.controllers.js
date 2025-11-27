import User from "../models/user.models.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import cloudinary from "../utils/cloudinary.js";

const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // <-- important for cross-site cookies
    maxAge: COOKIE_MAX_AGE,
    path: '/', // ensures cookie sent for all backend routes
};

// api/user/signup
const signup = asyncHandler(async (req, res) => {

    const { fullName, email, password, bio } = req.body
    if (!fullName || !email || !password || !bio) {
        // details missing
        throw new ApiError(400, 'Bad Request');
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new ApiError(409, "User with the same email already exists")
    }
    const user = await User.create({
        fullName, email, password, bio
    })
    const token = user.generateToken()
    res.cookie('token', token, cookieOptions);
    const userToReturn = user.toObject();
    delete userToReturn.password;
    return res.status(201).json(
        new ApiResponse(201, { user: userToReturn }, "User Registered successfully")
    )
}
)

// api/user/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email) {
        throw new ApiError(400, 'Email is Required')
    }
    if (!password) {
        throw new ApiError(400, 'Password is Required')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(400, 'User does not exist');
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, 'Incorrect Password')
    }
    const loggedInUser = await User.findById(user._id).select("-password")
    const token = user.generateToken()
    res.cookie('token', token, cookieOptions)
    return res.status(200).json(
        new ApiResponse(200, { user: loggedInUser }, "User Logged In successfully")
    )
})

// api/user/is-auth
const isAuth = asyncHandler(async (req, res) => {
    const user = req.user
    return res.status(200).json(
        new ApiResponse(200, { user: user })
    )
})

// api/user/logout
const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token', cookieOptions)
    return res.status(200).json(new ApiResponse(201, {}, "Logged Out Successfully"))
})

// api/user/update-profile
const updateProfile = asyncHandler(async (req, res) => {
    const { profilePic, bio, fullName } = req.body;
    if (!profilePic && !bio && !fullName) {
        throw new ApiError(400, "Bad Request");
    }

    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    // Prepare updates only for provided fields
    let shouldUpload = false;
    if (typeof bio !== "undefined") user.bio = bio;
    if (typeof fullName !== "undefined") user.fullName = fullName;

    if (profilePic) {
        // detect base64 / data URL (upload) vs already-a-URL (just set)
        const isBase64 =
            typeof profilePic === "string" &&
            (profilePic.startsWith("data:") || profilePic.includes("base64,"));

        if (isBase64) {
            // upload to Cloudinary
            const upload = await cloudinary.uploader.upload(profilePic, {
                folder: "your_app/profile_pics",
                overwrite: true,
            });

            // delete old Cloudinary image if we have its public_id
            if (user.profilePicPublicId) {
                try {
                    await cloudinary.uploader.destroy(user.profilePicPublicId);
                } catch (err) {
                    // non-fatal: log and continue
                    console.warn("Cloudinary old image delete failed:", err.message || err);
                }
            }

            user.profilePic = upload.secure_url;
            user.profilePicPublicId = upload.public_id;
        } else {
            // Received a URL — just assign it (no delete)
            user.profilePic = profilePic;
            // keep user.profilePicPublicId as-is unless you have a way to map URL->public_id
        }
    }

    const updatedUser = await user.save();

    // Remove sensitive fields if any
    const userToReturn = updatedUser.toObject();
    delete userToReturn.password;

    return res.status(200).json(
        new ApiResponse(200, { user: userToReturn }, "User Profile Updated successfully")
    );
});



export { signup, login, isAuth, logout, updateProfile }