const mongoose = require('mongoose'); 

function connectToDb(){
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Database connected successfully'))
        .catch(err => console.error('Database connection error:', err));
    
    return mongoose.connection;
}

module.exports = connectToDb;