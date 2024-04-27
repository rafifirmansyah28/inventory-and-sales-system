import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'statuses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.text('description').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
