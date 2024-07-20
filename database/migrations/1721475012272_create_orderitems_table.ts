import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orderitems'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user').notNullable()
    })
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('quantity').notNullable()
      table.integer('product').unsigned().references('id').inTable('products').notNullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
