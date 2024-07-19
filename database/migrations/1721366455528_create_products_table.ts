import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.decimal('price', 12, 2).notNullable()
      table.decimal('discount_price', 12, 2).notNullable()
      table.text('description').notNullable()
      table.integer('total_quantity').notNullable()
      table.string('featured_image').notNullable()
      table.json('images').notNullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
