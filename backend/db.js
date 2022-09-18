const mongoose = require('mongoose');
const mongooseUri = "mongodb://localhost:27017/iNotes?directConnection=true&tls=false&readPreference=primary";

const connectToMongo = () =>{
    mongoose.connect(mongooseUri, () => {
        console.log("Connected to Mongoos DB Successfully");
    })
}

module.exports = connectToMongo;