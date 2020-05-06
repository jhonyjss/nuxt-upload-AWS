import express from 'express'
import session from 'express-session';
const app = express()
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));

// Require API routes
const sqlite = require('./routes/db.js')

// Import API Routes
app.use(sqlite)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}

export default {
  path: '/api',
  handler: app
}