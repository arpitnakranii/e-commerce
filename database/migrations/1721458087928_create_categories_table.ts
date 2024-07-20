import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable().unique()
      table.string('color').notNullable()
      table.string('icon').notNullable()
      table.string('image').notNullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
