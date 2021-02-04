const mongoose = require('mongoose')
const config = require('config') // from library config - search for config/default.json
const db = config.get('mongoURI')

const connectDb = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('MongoDB Connected...')
    } catch (err) {
        console.error(err.message)
        // Exit process with failure
        process.exit(1)
    }
}

module.exports = connectDb