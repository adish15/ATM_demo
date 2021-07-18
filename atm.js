const mongoose=require('mongoose');

//ATM details Schema
const atmSchema = mongoose.Schema({
    data: {
        type: Object
    },
    uid: {
        type: Number
    }
})


exports.AtmModel = mongoose.model('atm', atmSchema);