import Client from 'App/Models/Admin/Client'

export default {
  async get() {
    const clients = await Client.query()
      .select('id', 'name', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc')

    return clients
  },

  async create(data: any) {
    const client = new Client()

    client.name = data.name
    client.address = data.address
    client.npsn = data.npsn
    client.npwp = data.npwp

    await client.save()

    return {
      success: 'Klien berhasil dibuat',
      data: client,
    }
  },

  async detail(id: number) {
    const client = await Client.query().where('id', id).first()

    return client
  },

  async update(client, data: any) {
    client.name = data.name
    client.address = data.address
    client.npsn = data.npsn
    client.npwp = data.npwp

    await client.save()

    return {
      success: 'Klien berhasil diubah',
      data: client,
    }
  },
}
