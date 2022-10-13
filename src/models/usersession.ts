import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, ModelAttributes } from 'sequelize'
import * as crypto from 'crypto'

function generateKey(userSession: UserSession): void {
  if (!userSession.get('key')) {
    const key = crypto.randomBytes(16).toString('hex')
    userSession.set('key', key)
  }
}

export default class UserSession extends Model<InferAttributes<UserSession>, InferCreationAttributes<UserSession>> {
  declare id: CreationOptional<number>
  declare key: CreationOptional<string>
  declare userId: ForeignKey<number>
  declare lastSeen: CreationOptional<Date>
  logout(): void {
    this.destroy({ force: true })
  }
}

const attributes: ModelAttributes = {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  key: {
    type: DataTypes.STRING,
    defaultValue: () => crypto.randomBytes(16).toString('hex'),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lastSeen: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}

const options = {
  tableName: 'user_sessions',
  hooks: {
    beforeValidate: generateKey,
  },
}

const associations = (models: any): void => {
  UserSession.belongsTo(models.User)
}

export const userSessionInit = { class: UserSession, attributes, options, associations }

