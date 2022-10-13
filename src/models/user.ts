import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelAttributes } from 'sequelize'
import * as crypto from 'crypto'

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex')
}

function generteHashedPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

function hashPassword(user: User): void {
  if (user.changed('password')) {
    const password = user.get('password')
    const salt = user.get('salt') || generateSalt()
    user.set('salt', salt)
    user.set('password', generteHashedPassword(password, salt))
    user.changed('password', false)
  }
}

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare email: string
  declare name: string
  declare salt: CreationOptional<string>
  declare password: string
  checkPassword(password: string): boolean {
    return (this.password === generteHashedPassword(password, this.salt))
  }
}

const attributes: ModelAttributes = {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}

const options = {
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['password', 'salt'] } },
  scopes: { full: {} },
  hooks: {
    beforeValidate: hashPassword,
  },
}

const associations = (models: any) => {
  User.hasMany(models.UserSession, { foreignKey: 'userId', onDelete: 'cascade' })
}

export const userInit = { class: User, attributes, options, associations }

