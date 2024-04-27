import ClientStackholder from 'App/Models/Admin/ClientStackholder'

export default {
  async get() {
    const clientStackholders = await ClientStackholder.query()
      .select('*')
      .preload('client', (client) => client.select('id', 'name'))
      .orderBy('created_at', 'desc')

    return clientStackholders
  },

  async create(data: any) {
    const clientStackholder = new ClientStackholder()

    clientStackholder.name = data.name
    clientStackholder.nip = data.nip
    clientStackholder.job_position = data.job_position
    clientStackholder.phone_number = data.phone_number
    clientStackholder.client_id = data.client_id

    await clientStackholder.save()

    return {
      success: 'Pemangku jabatan klien berhasil dibuat',
      data: clientStackholder,
    }
  },

  async detail(id: number) {
    const clientStackholder = await ClientStackholder.query().select('*').where('id', id).first()

    return clientStackholder
  },

  async update(clientStackholder, data: any) {
    clientStackholder.name = data.name
    clientStackholder.nip = data.nip
    clientStackholder.job_position = data.job_position
    clientStackholder.phone_number = data.phone_number
    clientStackholder.client_id = data.client_id

    await clientStackholder.save()

    return {
      success: 'Pemangku jabatan klien berhasil dibuat',
      data: clientStackholder,
    }
  },

  async stackholdersOfClient(client_id: number) {
    const stackholdersOfClient = await ClientStackholder.query()
      .select('id', 'client_id', 'name', 'job_position')
      .where('client_id', client_id)

    return stackholdersOfClient
  },
}
