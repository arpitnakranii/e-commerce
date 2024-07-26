import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orderitems'

  async up() {
    this.schema.renameTable('orderitems', 'order_items')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
