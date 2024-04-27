import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/Admin/User'

export default class extends BaseSeeder {
  public async run() {
    await User.create({
      name: 'Admin Semua Perusahaan',
      email: 'admin@yopmail.com',
      password: 'rahasia',
      isAdmin: true,
    })
  }
}
