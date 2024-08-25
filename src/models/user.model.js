import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
},{
    timestamps: true,  // adds createdAt and updatedAt fields automatically
})

export default mongoose.model('User', userSchema);