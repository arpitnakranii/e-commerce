import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Orderitem extends BaseModel {
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
}
