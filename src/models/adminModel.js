const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
            default: ""
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            default: ""
        },

        mobile: {
            type: String,
            default: ""
        },

        password: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", userSchema);
