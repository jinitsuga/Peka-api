import dotenv from 'dotenv'

import app from './app'

import Database from './services/Database.service'

// Load env variables
dotenv.config()
const { PORT } = process.env

// Connect to the database and init the HTTP server
Database.connect().then(() => {
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
})

