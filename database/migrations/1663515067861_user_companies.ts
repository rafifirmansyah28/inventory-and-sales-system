import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().unsigned()
      table.integer('company_id').notNullable().unsigned()
      table.string('phone_number', 13).nullable()
      table.string('job_position', 255).nullable()
      table.text('signature_image').nullable()
      table.timestamp('created_at', { useTz: false }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).defaultTo(this.now())

      // Foreign Key
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.foreign('company_id').references('companies.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
