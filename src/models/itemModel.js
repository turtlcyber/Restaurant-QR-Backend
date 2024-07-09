const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const itemSchema = new mongoose.Schema({

    userId: {
        type: String,
        default: ""
    },

    menuId: {
        type: String,
        default: ""
    },

    item_name: {
        type: String,
        default: "",
    },

    menuName: {
        type: String,
        default: "",
    },

    description: {
        type: String,
        default: "",
    },

    selling_price: {
        type: Number,
        default: 0
    },

    isTaxable: {
        type: Boolean
    },

    preparing_time: {
        type: String,
        default: ""
    },

    notes: {
        type: String,
        default: ""
    },

    item_images: [
        { 
            imgName: { type: String, default: "" },
            imgPath: { type: String, default: "" }
        }
    ],

    visit_count: {
        type: Number,
        default: 0
    },

    status: {
        type: Boolean,
    },

    seo_keywords: [],

    video_link: {
        type: String,
        default: ""
    },

    isVeg: {
        type: Boolean
    },
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);