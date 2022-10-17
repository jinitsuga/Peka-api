import https from 'https'
import { IncomingMessage } from 'http'
import { URLSearchParams } from 'url'
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'

import UserSession from '../models/usersession'

import { setToken } from '../helpers'

// Load env variables
dotenv.config()
const { HCAPTCHA_SECRET } = process.env

type hcpatchaResponse = {
	success: boolean
	challengeTs: Date
	hostname: string
	credit: boolean
	errorCodes: Array<string>
	score: number
	scoreReason: Array<string>
}

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

  /**
   * Checks to see if there's a valid captcha response
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   * @param {function} next
   */
  static async captcha(req: Request, res: Response, next: NextFunction) {
    const { captcha } = req.body
    if (!captcha) return res.sendStatus(400)
    const captchaData = (new URLSearchParams({ secret: HCAPTCHA_SECRET, response: captcha } as any)).toString()
    const captchaReq = https.request(
      {
        hostname: 'hcaptcha.com',
        path: '/siteverify',
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(captchaData),
        },
      },
      (captchaRes: IncomingMessage) => {
        if (captchaRes.statusCode !== 200) return res.sendStatus(500)
        captchaRes.on('data', (data: string) => {
          const captchaResJson: hcpatchaResponse = JSON.parse(data)
          if (!captchaResJson.success) return res.sendStatus(401)
          next()
        })
      }
    )
    captchaReq.on('error', (error: Error) => {
      console.error(error)
      res.sendStatus(500)
    })
    captchaReq.write(captchaData)
    captchaReq.end()
  }
}


export default AuthMiddleware
