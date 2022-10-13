import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'

// Controllers
import UserController from './controllers/user.controller'

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
app.get('/', (req: Request, res: Response) => res.send('Peka API v0.1'))

app.post('/signup', UserController.signup)
app.post('/signin', UserController.signin)

export default app
