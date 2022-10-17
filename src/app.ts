import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'

// Controllers
import UserController from './controllers/user.controller'
import ProductController from './controllers/product.controller'

// Middlewares
import AuthMiddleware from './middlewares/auth.middleware'
import OfferController from './controllers/offer.controler'

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
app.get('/', (req: Request, res: Response) => res.send('Peka API v0.5.1'))

app.post('/signup', UserController.signup)
app.post('/signin', UserController.signin)
app.get('/signout', AuthMiddleware.authenticate, UserController.signout)
app.post('/reset-password', UserController.getResetToken)
app.post('/reset-password/:token', UserController.resetPassword)
app.post('/profile', AuthMiddleware.authenticate, UserController.update)

app.get('/products', ProductController.getAll)

app.post('/offers', AuthMiddleware.authenticate, OfferController.create)
app.put('/offers/:offerId', AuthMiddleware.authenticate, OfferController.update)
app.delete('/offers/:offerId', AuthMiddleware.authenticate, OfferController.delete)
app.get('/users/:userId/offers', AuthMiddleware.authenticate, OfferController.getAll)

export default app
