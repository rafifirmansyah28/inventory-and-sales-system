import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('subtotal').notNullable().alter()
      table.integer('total').notNullable().alter()
      table.tinyint('tax_percent').nullable().alter()
      table.integer('shipping_cost').defaultTo(0).alter()

      table.text('name').notNullable()
      table.timestamp('processed_at', { useTz: false }).nullable()
      table.timestamp('ended_at', { useTz: false }).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('subtotal').notNullable().alter()
      table.decimal('total').notNullable().alter()
      table.decimal('tax_percent', 3, 2).notNullable().alter()
      table.decimal('shipping_cost').defaultTo('0.00').alter()

      table.dropColumn('name')
      table.dropColumn('processed_at')
      table.dropColumn('ended_at')
    })
  }
}
