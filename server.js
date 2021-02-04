const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('API Running')
})

// looking for evironment variable named port. Mongodb will go to the environment variables to check for it.
// but if we are running localy we will use port 5000
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})