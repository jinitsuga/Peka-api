import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelAttributes } from 'sequelize'
import * as crypto from 'crypto'

function generateRandomString(length: number = 16): string {
  return crypto.randomBytes(length).toString('hex')
}

function generteHashedPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare email: string
  declare name: string
  declare salt: CreationOptional<string>
  declare password: string
  declare resetPasswordToken: CreationOptional<string | null>
  declare resetPasswordTtl: CreationOptional<Date | null>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  checkPassword(password: string): boolean {
    return (this.password === generteHashedPassword(password, this.salt))
  }
  async generateResetPasswordToken(): Promise<string> {
    const token = generateRandomString()
    this.resetPasswordToken = token
    // 15 minutes TTL for the password reset token
    this.resetPasswordTtl = new Date(Date.now() + 15 * 60 * 1000)
    await this.save()
    return token
  }
  async isResetPasswordTokenValid(): Promise<boolean> {
    // Check if there's a token & a token TTL set
    if ((!this.resetPasswordToken) || (!this.resetPasswordTtl)) return false
    // Check if the token is still valid
    const valid = this.resetPasswordTtl.getTime() > Date.now()
    // If the token is not valid reset the token & token TTL fields on the user
    if (!valid) {
      await this.clearResetPasswordToken(true)
    }
    return valid
  }
  async clearResetPasswordToken(save: boolean = false): Promise<void> {
    this.resetPasswordToken = null
    this.resetPasswordTtl = null
    if (save) await this.save()
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
    set(this: User, value: string) {
      // Get a new salt
      const salt = generateRandomString()
      // Hash the password
      const password = generteHashedPassword(value, salt)
      // Set the new password & salt
      this.setDataValue('password', password)
      this.setDataValue('salt', salt)
    },
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
  },
  resetPasswordTtl: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}

const options = {
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['email', 'password', 'salt', 'resetPasswordToken', 'resetPasswordTtl'] } },
  scopes: { full: {}, self: { attributes: { exclude: ['password', 'salt', 'resetPasswordToken', 'resetPasswordTtl'] } } },
  hooks: {},
}

const associations = (models: any) => {
  User.hasMany(models.UserSession, { foreignKey: 'userId', onDelete: 'cascade' })
}

export const userInit = { class: User, attributes, options, associations }

