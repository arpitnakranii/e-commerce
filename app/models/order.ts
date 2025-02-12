import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import Order_item from './order_item.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare order_item: number

  @column()
  declare shipping_address1: string

  @column()
  declare shipping_address2: string

  @column()
  declare city: string

  @column()
  declare zip: number

  @column()
  declare country: string

  @column()
  declare phone: string

  @column()
  declare status: string

  @column()
  declare total_price: number

  @column()
  declare user_id: number

  @column.dateTime()
  declare order_date: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare userData: BelongsTo<typeof User>

  @belongsTo(() => Product, {
    foreignKey: 'order_item',
  })
  declare ProductData: BelongsTo<typeof Product>

  @belongsTo(() => Order_item, {
    foreignKey: 'order_item',
  })
  declare orderDetails: BelongsTo<typeof Order_item>
}
