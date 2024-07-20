import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('order_item').unsigned().references('id').inTable('orderitems').notNullable()
      table.text('shipping_address1').notNullable()
      table.text('shipping_address2').notNullable()
      table.string('city').notNullable()
      table.integer('zip').notNullable()
      table.string('country').notNullable()
      table.string('phone').notNullable()
      table.enum('status', ['pending', 'accept', 'reject']).notNullable()
      table.integer('total_price').notNullable()
      table.integer('user').notNullable()

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
