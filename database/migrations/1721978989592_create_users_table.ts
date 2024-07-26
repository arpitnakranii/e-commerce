import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('emailVerified_at', 'email_verified_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
