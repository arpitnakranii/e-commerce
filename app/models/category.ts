import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'

import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Orderitem from './orderitem.js'

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
  declare icon: string

  @column()
  declare image: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>

  @hasMany(() => Orderitem)
  declare orderitems: HasMany<typeof Orderitem>

  @manyToMany(() => Product, {
    pivotTable: 'product_categories',
  })
  declare productData: ManyToMany<typeof Product>
}
