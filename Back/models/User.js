import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "must provide username"],
        trim: true,
        maxlength: [20, "username can not be more than 20 letters"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "must provide Password"],
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [128, "Password cannot be more than 128 characters"]
    },
    kittyCoins: {
        type: Number,
        default: 500,
    },
    email: {
        type: String,
        required: [true, "must provide Email"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    }
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;