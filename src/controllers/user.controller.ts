import { Request, Response } from 'express'

import Database from '../services/Database.service.js'

import { UserModel } from '../../models/user.js'
import { UserSessionModel } from '../../models/usersession.js'

// Models
const { user: User, user_session: UserSession } = Database.getInstance().models

/**
 * Creates a UserSession and sets up a cookie with the session's key
 *
 * @param {UserModel} user The user to create the session for
 * @param {Express.Request} res The request object
 * @param {Express.Response} res The response object
 */
async function setToken(user: UserModel, req: Request, res: Response) {
  const session = await UserSession.create({ userId: user.id }) as UserSessionModel
  res.cookie('token', session.key, { sameSite: 'none', secure: !!req.secure, httpOnly: true, domain: req.hostname })
}

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
    let user = await User.findOne({ where: { email } }) as UserModel
    if (user) return res.sendStatus(409)
    user = await User.create({ email, name, password }) as UserModel
    // Create a session for the user and send the session's key as a cookie
    await setToken(user, req, res)
    return res.json({ success: true, user })
  }

  /**
   * Express handler for login a user
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async signin(req: Request, res: Response) {
    const { email, password } = req.body
    // Check required fields
    if ((!email) || (!password)) return res.sendStatus(400)
    // Get the user & verify it exists and its password is correct
    const user = await User.scope('full').findOne({ where: { email } }) as UserModel
    if ((!user) || (!(user as any).checkPassword(password))) return res.sendStatus(403)
    // Create a session for the user and send the session's key as a cookie
    await setToken(user, req, res)
    return res.json({ success: true, user })
  }
}