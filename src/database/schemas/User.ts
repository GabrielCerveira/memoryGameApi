import mongoose from "mongoose";

const User = new mongoose.Schema({
    name: {
        type: String,
        requerid: true,
    },
    email: {
        type: String,
        requerid: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        requerid: true,
        //Para não mostrar na pesquisa
        //select: false
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", User);