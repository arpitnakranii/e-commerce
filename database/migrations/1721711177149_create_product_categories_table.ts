import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_categories'

  async up() {
    this.schema.createTable('product_categories', (table) => {
      table.increments('id')
      table.integer('product_id').unsigned().references('products.id').onDelete('CASCADE')
      table.integer('category_id').unsigned().references('categories.id').onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
