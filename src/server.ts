import dotenv from 'dotenv'

import app from './app'

// Load env variables
dotenv.config()
const { PORT } = process.env

// Connect to the database and init the HTTP server
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`))