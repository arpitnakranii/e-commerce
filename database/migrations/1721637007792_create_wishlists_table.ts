import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'wishlists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .unsigned()
        .notNullable()
        .onDelete('CASCADE')
      table
        .integer('product_id')
        .references('id')
        .inTable('products')
        .unsigned()
        .notNullable()
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
