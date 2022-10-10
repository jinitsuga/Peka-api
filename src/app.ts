import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

const { urlencoded, json } = bodyParser

// Server
const app = express()

// Body parser
app.use(urlencoded({ extended: true }))
app.use(json())

// Cookie parser
app.use(cookieParser())

// CORS
app.use(cors({
  credentials: true,
  origin: (origin, callback) => callback(null, true),
}))

// Routes
app.get('/', (req, res) => res.send('Hello World!'))

export default app
