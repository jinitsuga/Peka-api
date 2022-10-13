import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelAttributes } from 'sequelize'

export default class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>
  declare name: string
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  tableName: 'products',
  hooks: {},
}

const associations = (models: any) => {}

export const productInit = { class: Product, attributes, options, associations }

