import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'order_details'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('product_price').notNullable().alter()
      table.integer('subtotal').notNullable().alter()
      table.smallint('qty_good_condition').nullable().alter()
      table.smallint('qty_bad_condition').nullable().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('product_price').notNullable().alter()
      table.decimal('subtotal').notNullable().alter()
      table.smallint('qty_good_condition').notNullable().alter()
      table.smallint('qty_bad_condition').notNullable().alter()
    })
  }
}
