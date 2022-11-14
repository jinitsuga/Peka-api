import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { Op } from 'sequelize'

import Offer from '../models/offer'
import Product from '../models/product'
import User from '../models/user'

// Load env variables
dotenv.config()
const { PAGINATION_SIZE } = process.env

function getLimit(): number {
  return Number(PAGINATION_SIZE) || 12
}

function getOffset(page: any): number {
  return (Math.abs((Number(page) || 1)) - 1) * getLimit()
}

export default class OfferController {
  /**
   * Express handler for creating a new offer
   * 
   * Precondition: There's an active user session with this request
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async create(req: Request, res: Response) {
    const {
      quantity,
      quantityUnit,
      type,
      description,
      pictures,
      productId,
      session,
    } = req.body
    if (
      (!quantity) ||
      (!quantityUnit) ||
      (!type) ||
      (!productId) ||
      (!Offer.getAttributes().quantityUnit.values?.includes(quantityUnit)) ||
      (!Offer.getAttributes().type.values?.includes(type))
    ) return res.sendStatus(400)
    const userId = session.userId
    const product = await Product.findByPk(productId)
    if (!product) return res.sendStatus(404)
    const offer = await Offer.create({ quantity, quantityUnit, type, description, pictures, productId, userId }, { include: [Product, User] })
    return res.json(offer)
  }

  /**
   * Express handler for updating an offer
   * 
   * Precondition: There's an active user session with this request
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async update(req: Request, res: Response) {
    const {
      quantity,
      quantityUnit,
      type,
      description,
      pictures,
      productId,
      session,
    } = req.body
    const { offerId } = req.params
    if (
      (!quantity) ||
      (!quantityUnit) ||
      (!type) ||
      (!productId) ||
      (!Offer.getAttributes().quantityUnit.values?.includes(quantityUnit)) ||
      (!Offer.getAttributes().type.values?.includes(type))
    ) return res.sendStatus(400)
    const offer = await Offer.findByPk(offerId, { include: [Product, User] })
    if (!offer) return res.sendStatus(404)
    const product = await Product.findByPk(productId)
    if (!product) return res.sendStatus(404)
    const userId = session.userId
    if (offer.userId != userId) return res.sendStatus(403)
    await offer.update({ quantity, quantityUnit, type, description, pictures, productId })
    return res.json(offer)
  }

  /**
   * Express handler for deleting an offer
   * 
   * Precondition: There's an active user session with this request
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async delete(req: Request, res: Response) {
    const { session } = req.body
    const { offerId } = req.params
    const offer = await Offer.findByPk(offerId)
    if (!offer) return res.sendStatus(404)
    const userId = session.userId
    if (offer.userId != userId) return res.sendStatus(403)
    await offer.destroy()
    return res.sendStatus(200)
  }

  /**
   * Express handler for getting all offers from a user
   * 
   * Precondition: There's an active user session with this request
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async getAllUser(req: Request, res: Response) {
    const { userId } = req.params
    const { page } = req.query
    const user = await User.findByPk(userId)
    if (!user) return res.sendStatus(404)
    const offers = await Offer.findAll({ where: { userId }, limit: getLimit(), offset: getOffset(page), include: [Product, User] })
    return res.json(offers)
  }

  /**
   * Express handler for getting all offers on the system
   * 
   * Precondition: There's an active user session with this request
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async getAll(req: Request, res: Response) {
    const { page } = req.query
    const offers = await Offer.findAll({ limit: getLimit(), offset: getOffset(page), include: [Product, User] })
    return res.json(offers)
  }

  /**
   * Express handler for searching offers
   * 
   * Precondition: There's an active user session with this request
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async search(req: Request, res: Response) {
    const { products, types } = req.query
    const { page } = req.query
    const productsArray = products?.toString().split(',') || []
    const typesArray = types?.toString().split(',') || []
    const offers = await Offer.findAll({
      where: {
        productId: {
          [Op.or]: productsArray
        },
        type: {
          [Op.or]: typesArray
        }
      },
      include: [Product, User],
      limit: getLimit(),
      offset: getOffset(page),
    })
    return res.json(offers)
  }
}