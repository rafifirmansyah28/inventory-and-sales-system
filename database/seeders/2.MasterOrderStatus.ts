import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Status from 'App/Models/Company/Status'

export default class extends BaseSeeder {
  public async run() {
    const statuses = [
      {
        name: 'Pesanan dalam pengiriman',
        description:
          'Pesanan dan surat pesanan sudah dibuat, dan pesanan sedang dalam pengiriman ke Pembeli. Menunggu Pembeli menerima pesanan.',
        sequence: 1,
      },
      {
        name: 'Pesanan telah diterima',
        description:
          'Pesanan telah diterima oleh Pembeli. Pembeli menunggu untuk menerima invoice (faktur).',
        sequence: 2,
      },
      {
        name: 'Menunggu pembayaran',
        description:
          'Invoice telah dikirim oleh Penjual. Penjual menunggu pembayaran dari Pembeli.',
        sequence: 3,
      },
      {
        name: 'Pesanan telah dikirim ',
        description:
          'Pesanan telah dibayar oleh Pembeli dan Pesanan telah terkirim. Pesanan selesai.',
        sequence: 4,
      },
    ]

    await Status.createMany(statuses)
  }
}
