import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'

import Category from '#models/category'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Orderitem from '#models/order_item'
import Review from '#models/review'
import Wishlist from '#models/wishlist'
import User from './user.js'
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
  declare total_quantity: number

  @column()
  declare featured_image: string

  @column()
  declare images: string

  @column()
  declare user_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category, {
    foreignKey: 'category',
  })
  declare categories: BelongsTo<typeof Category>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare userData: BelongsTo<typeof User>

  @hasMany(() => Orderitem)
  declare orderitems: HasMany<typeof Orderitem>

  @hasMany(() => Review)
  declare review: HasMany<typeof Review>

  @hasMany(() => Wishlist)
  declare wishlist: HasMany<typeof Wishlist>

  @manyToMany(() => Category, {
    pivotTable: 'product_categories',
  })
  declare catagoriesData: ManyToMany<typeof Category>
}
