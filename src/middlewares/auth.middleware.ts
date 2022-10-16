import { Request, Response, NextFunction } from 'express'

import UserSession from '../models/usersession'

import { setToken } from '../helpers'

class AuthMiddleware {
  /**
   * Checks to see if a user is authenticated
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   * @param {function} next
   */
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    // Get the session's key from the cookies
    const { token } = req.cookies
    if (!token) return res.sendStatus(401)
		// Get the UserSession from the DB
    const session = await UserSession.findOne({ where: { key: token } })
    if (!session) return res.sendStatus(401)
    // Check if the session is still valid
    if (session.lastSeen.getTime() + 24 * 60 * 60 < Date.now()) {
      session.logout()
      setToken('', req, res)
      return res.sendStatus(401)
    }
    // Update the LastSeen field of the session
    session.lastSeen = new Date()
    await session.save()
		// Add the userSession to the request body
    req.body['session'] = session
    next()
  }
}


export default AuthMiddleware
