import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'order_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_id').notNullable().unsigned()
      table.integer('product_id').notNullable().unsigned()
      table.string('product_name', 255).notNullable()
      table.decimal('product_price').notNullable()
      table.smallint('qty').notNullable()
      table.smallint('qty_good_condition').notNullable()
      table.smallint('qty_bad_condition').notNullable()
      table.decimal('subtotal').notNullable()
      table.timestamp('created_at', { useTz: false }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).defaultTo(this.now())

      // Foreign Key
      table.foreign('order_id').references('orders.id').onDelete('CASCADE')
      table.foreign('product_id').references('products.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
