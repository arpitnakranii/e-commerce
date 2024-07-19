import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AuthAccessToken extends BaseModel {
  @column({ isPrimary: true })
  id: number | undefined

  @column()
  tokenableId: number | undefined

  @column()
  type: string | undefined

  @column()
  name: string | null | undefined

  @column()
  hash: string | undefined

  @column()
  abilities: string | undefined

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  createdAt: DateTime | undefined

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt: DateTime | undefined

  @column.dateTime()
  lastUsedAt: DateTime | null | undefined

  @column.dateTime()
  expiresAt: DateTime | null | undefined
}
