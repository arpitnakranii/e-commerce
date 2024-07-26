import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'

import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Order_item from './order_item.js'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare name: string

  @column()
  declare color: string

  @column()
  declare user_id: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>

  @hasMany(() => Order_item)
  declare order_items: HasMany<typeof Order_item>

  @manyToMany(() => Product, {
    pivotTable: 'product_categories',
  })
  declare productData: ManyToMany<typeof Product>
}
