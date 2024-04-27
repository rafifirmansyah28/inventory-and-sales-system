import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'client_stackholders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('client_id').notNullable().unsigned()
      table.string('name', 255).notNullable()
      table.string('identification_number', 19).nullable()
      table.string('job_position', 255).nullable()
      table.string('phone_number', 13).nullable()
      table.timestamp('created_at', { useTz: false }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).defaultTo(this.now())

      // Foreign Key
      table.foreign('client_id').references('clients.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
