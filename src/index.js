const express = require('express'),
      mongoose = require('mongoose'),
      os = require('os'),
      bodyParser = require('body-parser')

const app = express()

// Middlewares
app.use(bodyParser.json())

// Mongoose connection
mongoose.connect(process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://mongodb:27017/chirper', { useNewUrlParser: true })

// Models
require('./models')

// Routes
app.use('/post', require('./routes'))

// Error Handling
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    service: 'post-service',
    host: os.hostname(),
    message: err.message,
    info: "Beep Boop! It seems I have been a dumb computer. Pssst, blame Matt!\nSysAdmin has been notified of this error."
  })
})

// Start
app.listen(process.env.PORT, () => console.log(`Listening on port ${ process.env.PORT } (${os.hostname()})`))