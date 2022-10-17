import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, ModelAttributes } from 'sequelize'

export default class Offer extends Model<InferAttributes<Offer>, InferCreationAttributes<Offer>> {
  declare id: CreationOptional<number>
  declare quantity: number
  declare quantityUnit: string
  declare type: string
  declare description: CreationOptional<string> 
  declare pictures: CreationOptional<string>
  declare userId: ForeignKey<number>
  declare productId: ForeignKey<number>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

const attributes: ModelAttributes = {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  quantityUnit: {
    type: DataTypes.ENUM,
    values: (['units', 'kilograms', 'grams', 'bundles']),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: (['product', 'seedling', 'seeds']),
    defaultValue: 'product',
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  pictures: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  tableName: 'offers',
  hooks: {},
}

const associations = (models: any) => {
  Offer.belongsTo(models.Product)
  Offer.belongsTo(models.User)
}

export const offerInit = { class: Offer, attributes, options, associations }

