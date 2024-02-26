const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({   
    name: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now(),
        //required: true
    }
}, { versionKey: false }); // Add this line to disable the version key


module.exports = mongoose.model('User', userSchema);
//const User = mongoose.model('NomDeLaCollection', userSchema);
