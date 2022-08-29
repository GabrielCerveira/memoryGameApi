import mongoose, { Schema } from "mongoose";

const ImageMemory = new mongoose.Schema({
    name: {
        type: String,
        requerid: true,
        unique: true,
        upercase: true
    },
    description: {
        type: String,
        requerid: true
    },
    image: {
        type: String,
        unique: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("ImageMemory", ImageMemory);