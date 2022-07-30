const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { initializeApp, cert } = require('firebase-admin/app')
const functions = require('firebase-functions')
const serviceAccount = require('./serviceAccountKey.json')
const appRoute = require('./src/controllers/Authentication')

const app = express()

initializeApp({
  credential: cert(serviceAccount),
})

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', appRoute)

// app.listen(5000, () => {
//   console.log('Server is running on port 5000')
// })

exports.Auth = functions.https.onRequest(app)
