import dotenv from 'dotenv'
import { Request, Response } from 'express'

import User from '../models/user'

import UserSession from '../models/usersession'

import { setToken } from '../helpers'
import Mailer from '../services/Mailer.service'

// Load env variables
dotenv.config()
const { WEB_URL, WEB_RESET_PASSWORD_PATH } = process.env

export default class UserController {
  /**
   * Express handler for registering a new user
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async signup(req: Request, res: Response) {
    const { email, name, password } = req.body
    if ((!email) || (!name) || (!password)) return res.sendStatus(400)
    let user = await User.findOne({ where: { email } })
    if (user) return res.sendStatus(409)
    user = await User.create({ email, name, password })
    // Create a session for the user and send the session's key as a cookie
    const session = await UserSession.create({ userId: user.id })
    setToken(session.key, req, res)
    // Get the User again with the limited scope (not fetching password, salt, etc.)
    user = await User.findByPk(user.id)
    return res.json(user)
  }

  /**
   * Express handler for login in a user
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async signin(req: Request, res: Response) {
    const { email, password } = req.body
    // Check required fields
    if ((!email) || (!password)) return res.sendStatus(400)
    // Get the user & verify it exists and its password is correct
    let user = await User.scope('full').findOne({ where: { email } })
    if ((!user) || (!user.checkPassword(password))) return res.sendStatus(403)
    // Create a session for the user and send the session's key as a cookie
    const session = await UserSession.create({ userId: user.id })
    setToken(session.key, req, res)
    // Get the User again with the limited scope (not fetching password, salt, etc.)
    user = await User.findByPk(user.id)
    return res.json(user)
  }

  /**
   * Express handler for login out a user
   * 
   * Precondition: There's an active user session with this request
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async signout(req: Request, res: Response) {
    const { session } = req.body
    // Get the user session
    const userSession = await UserSession.findOne({ where: { key: session.key } })
    // Logout the session
    userSession?.logout()
    // Unset the session cookie
    setToken('', req, res)
    return res.json({ success: true })
  }

  /**
   * Express handler for updating a User
   * 
   * Precondition: There's an active user session with this request
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async update(req: Request, res: Response) {
    const { email, name, password, session } = req.body
    if ((!email) || (!name)) return res.sendStatus(400)
    let user = await User.findByPk(session.userId)
    if (!user) return res.sendStatus(404)
    const userEmail = await User.findOne({ where: { email } })
    if ((userEmail) && (userEmail.id !== user.id)) return res.sendStatus(409)
    await user.update({ email, name, password })
    // Get the User again with the limited scope (not fetching password, salt, etc.)
    user = await User.findByPk(user.id)
    return res.json(user)
  }

  /**
   * Express handler for generating a reset password token
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async getResetToken(req: Request, res: Response) {
    const { email } = req.body
    // Check required fields
    if (!email) return res.sendStatus(400)
    // Get the user and check it exists
    const user = await User.findOne({ where: { email } })
    if (!user) return res.json({ success: true })
    // Generate a password reset token
    const token = await user.generateResetPasswordToken()
    const link = `${WEB_URL}/${WEB_RESET_PASSWORD_PATH}/${token}`
    try {
      await Mailer.sendEmail(user.email, 'Recuperar contraseña', 'password-reset', { link })
      return res.json({ success: true })
    } catch (error) {
      console.error(error)
      return res.sendStatus(500)
    }
  }

  /**
   * Express handler for resetting password token
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async resetPassword(req: Request, res: Response) {
    const { password } = req.body
    const { token } = req.params
    // Check required fields
    if (!password) return res.sendStatus(400)
    // Get the user associated with the given token
    const user = await User.scope('full').findOne({ where: { resetPasswordToken: token } })
    if (!user) return res.sendStatus(404)
    // Check if the token is valid
    if (!(await user.isResetPasswordTokenValid())) return res.sendStatus(401)
    // Clear the reset token
    await user.clearResetPasswordToken()
    // Reset the user's password
    user.password = password
    await user.save()
    return res.json({ success: true })
  }
}