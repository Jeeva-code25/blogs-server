const mongoose = require('mongoose');

async function dbConnect() {
    try {        
        await mongoose.connect(process.env.DATABASE_URL)
    } catch (err) {
        console.error(err);
    }
}

module.exports = dbConnect