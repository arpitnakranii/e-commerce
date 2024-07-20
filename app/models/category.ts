import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Product from '#models/product'

import { LucidModel } from '@adonisjs/lucid/types/model'
import type { HasMany } from '@adonisjs/lucid/types/relations'

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
}
