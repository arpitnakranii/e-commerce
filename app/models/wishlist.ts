import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Wishlist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare user_id: number

  @column()
  declare product_id: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Product, {
    foreignKey: 'product_id',
  })
  declare productData: BelongsTo<typeof Product>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare userData: BelongsTo<typeof User>
}
