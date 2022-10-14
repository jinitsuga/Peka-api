import { Request, Response } from 'express'

import Offer from '../models/offer'

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
    const offer = await Offer.create({ quantity, quantityUnit, type, description, pictures, productId, userId })
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
    const offer = await Offer.findByPk(offerId)
    if (!offer) return res.sendStatus(404)
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
    return res.json({ success: true })
  }
}