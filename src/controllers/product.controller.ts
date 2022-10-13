import { Request, Response } from 'express'

import Product from '../models/product'

export default class ProductController {
  /**
   * Express handler for getting a list of all products
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async getAll(req: Request, res: Response) {
    const { email, name, password } = req.body
    const products = await Product.findAll()
    return res.json(products)
  }
}