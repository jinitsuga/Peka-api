import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import * as crypto from 'crypto'

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>
  email: string
  name: string
  salt: CreationOptional<string>
  password: string
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex')
}

function generteHashedPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

function hashPassword(user: UserModel): void {
  if (user.changed('password')) {
    const password = user.get('password')
    const salt = user.get('salt') || generateSalt()
    user.set('salt', salt)
    user.set('password', generteHashedPassword(password, salt))
    user.changed('password', false)
  }
}

export default (sequelize: Sequelize) => {
  const User = sequelize.define<UserModel>('user', {
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
  }, { defaultScope: { attributes: { exclude: ['password', 'salt'] } }, scopes: { full: {} } })

  User.prototype.checkPassword = function(password: string) {
    return (this.password === generteHashedPassword(password, this.salt))
  }

  User.beforeValidate(hashPassword)

  return (models: any) => {
    User.hasMany(models.user_session, { foreignKey: 'userId', onDelete: 'cascade' })
  }
}

