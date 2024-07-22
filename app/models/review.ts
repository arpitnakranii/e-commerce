import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare product_id: number

  @column()
  declare user_id: number

  @column()
  declare rating: number

  @column()
  declare comment: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Product, {
    foreignKey: 'product_id',
  })
  declare products: BelongsTo<typeof Product>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare userData: BelongsTo<typeof User>
}
