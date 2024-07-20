import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'

import Category from '#models/category'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare price: number

  @column()
  declare discount_price: number

  @column()
  declare category: string
  @column()
  declare description: string

  @column()
  declare total_quantity: string

  @column()
  declare featured_image: string

  @column()
  declare images: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category, {
    foreignKey: 'category',
  })
  declare categories: BelongsTo<typeof Category>
}
