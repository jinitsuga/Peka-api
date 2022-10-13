import { Request, Response } from 'express'

import User from '../models/user'

import UserSession from '../models/usersession'

import { setToken } from '../helpers'

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
    return res.json({ success: true, user })
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
    const user = await User.scope('full').findOne({ where: { email } })
    if ((!user) || (!user.checkPassword(password))) return res.sendStatus(403)
    // Create a session for the user and send the session's key as a cookie
    const session = await UserSession.create({ userId: user.id })
    setToken(session.key, req, res)
    return res.json({ success: true, user })
  }

  /**
   * Express handler for login out a user
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
}