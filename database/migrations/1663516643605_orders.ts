import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('company_id').notNullable().unsigned()
      table.integer('client_id').notNullable().unsigned()
      table.integer('user_id').notNullable().unsigned()
      table.integer('client_stackholder_id').notNullable().unsigned()
      table.integer('status_id').notNullable().unsigned()
      table.decimal('subtotal').notNullable()
      table.decimal('total').notNullable()
      table.boolean('has_tax').notNullable()
      table.decimal('tax_percent', 3, 2).notNullable()
      table.decimal('shipping_cost').defaultTo('0.00')
      table.timestamp('created_at', { useTz: false }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).defaultTo(this.now())

      // Foreign Key
      table.foreign('company_id').references('companies.id').onDelete('CASCADE')
      table.foreign('client_id').references('clients.id').onDelete('CASCADE')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table
        .foreign('client_stackholder_id')
        .references('client_stackholders.id')
        .onDelete('CASCADE')
      table.foreign('status_id').references('statuses.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
