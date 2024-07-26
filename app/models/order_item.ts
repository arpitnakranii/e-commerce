import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare product: string

  @column()
  declare quantity: number

  @column()
  declare user: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Product, {
    foreignKey: 'product',
  })
  declare products: BelongsTo<typeof Product>

  @belongsTo(() => User, {
    foreignKey: 'user',
  })
  declare userData: BelongsTo<typeof User>

  @hasMany(() => OrderItem)
  declare order_items: HasMany<typeof OrderItem>
}
