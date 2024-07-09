const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const menuSchema = new mongoose.Schema({

    userId: {
        type: String,
        default: ""
    },

    title: {
        type: String,
        default: ""
    },

    thumbnail: {
        imgName: { type: String, default: "" },
        imgPath: { type: String, default: "" }
    },

    description: {
        type: String,
        default: ""
    },

    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);