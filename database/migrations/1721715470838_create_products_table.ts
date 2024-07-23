import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').references('id').inTable('users').unsigned()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
