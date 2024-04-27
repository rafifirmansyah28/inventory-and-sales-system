import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('url')
      table.string('method', 6)
      table.string('ip', 20)
      table.json('user_params')
      table.json('user_input')
      table.json('old_data')
      table.json('new_data')
      table.string('success_message', 500)
      table.string('error_message', 500)
      table.timestamp('created_datetime', { useTz: true }).notNullable()
      table.integer('created_by_user_id').unsigned()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
