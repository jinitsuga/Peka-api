import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import sequelize from 'sequelize'

import User from '../../models/user'
import UserSession from '../../models/usersession'

// Load env variables
dotenv.config()
const { NODE_ENV, DATABASE_URL, DEBUG } = process.env

class Database {
  static instance: Sequelize | undefined

  constructor() {
    const debug = DEBUG === 'TRUE'
    const prod = NODE_ENV === 'production'
    const dialectOptions = prod ? { ssl: { require: true, rejectUnauthorized: false } } : {}
    Database.instance = new Sequelize(DATABASE_URL || '', {
      dialect: 'postgres',
      logging: debug ? console.log : false,
      dialectOptions,
    })

    Database.setupModels()
  }

  static getInstance(): Sequelize {
    if (Database.instance) return Database.instance
    new Database()
    return this.getInstance()
  }

  static setupModels() {
    const modelDefiners = [User, UserSession]
    const associations = []

    // Define the models
    for (const modelDefiner of modelDefiners) {
      associations.push(modelDefiner(Database.getInstance()))
    }

    // Define the models' associations
    for (const association of associations) {
      association(Database.getInstance().models)
    }
  }

  static connect() {
    return Database.getInstance().authenticate()
  }

  static async migrate(options: sequelize.SyncOptions) {
    await Database.connect()
    return await Database.getInstance().sync(options)
  }

  static async close() {
    await Database.getInstance().close()
    return delete Database.instance
  }
}

export default Database
