import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import * as crypto from 'crypto'

export interface UserSessionModel extends Model<InferAttributes<UserSessionModel>, InferCreationAttributes<UserSessionModel>> {
  id: CreationOptional<number>
  key: string
  userId: ForeignKey<number>
  lastSeen: Date
}

function generateKey(userSession: UserSessionModel): void {
  if (!userSession.get('key')) {
    const key = crypto.randomBytes(16).toString('hex')
    userSession.set('key', key)
  }
}

export default (sequelize: Sequelize) => {
  const UserSession = sequelize.define<UserSessionModel>('user_session', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
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
  })

  UserSession.beforeValidate(generateKey)

  return (models: any): void => {
    UserSession.belongsTo(models.user)
  }
}

