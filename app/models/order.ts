import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
  declare total_price: string

  @column()
  declare user: number

  @column.dateTime()
  declare order_date: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
