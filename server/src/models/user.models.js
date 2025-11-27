import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    email: {
        type: String, trim: true,
        index: true,
        unique: true,
        required: [true, 'Email is required']
    },
    fullName: { type: String, required: true },
    password: { type: String, required: [true, 'Password is required'] },
    profilePic: { type: String, default: "" },
    bio: { type: String }
}, {
    timestamps: true, minimize: false
})

userSchema.pre('save', async function () {
     if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const User = mongoose.models.user || mongoose.model('User', userSchema)

export default User