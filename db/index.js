const mongoose = require('mongoose');
const dbPath = 'mongodb://localhost:27017/urussu';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(dbPath, options, (err) => {
    if(err) {
        console.error(`Unable to connect ${dbPath}`);
        console.error(err.message);
        return;
    }

    console.log(`DB connection has been established with ${dbPath}`);
});

let db = mongoose.connection;

db.on('error', err => {
    console.error('A db error occurred', err.message);
    throw Error(err);
});

module.exports = db;