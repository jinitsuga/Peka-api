import { Request, Response } from "express";

/**
 * Sets up a token cookie with a session's key
 *
 * @param {string} token The session's key
 * @param {Express.Request} res The request object
 * @param {Express.Response} res The response object
 */
export function setToken(token: string, req: Request, res: Response) {
  res.cookie('token', token, { sameSite: 'none', secure: !!req.secure, httpOnly: true, domain: req.hostname })
}