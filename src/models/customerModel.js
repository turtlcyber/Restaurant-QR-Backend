const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    email: {
        type: String,
    },

    mobile: {
        type: String,
    },
}, {timestamps: true});


module.exports = mongoose.model("Customer", customerSchema);