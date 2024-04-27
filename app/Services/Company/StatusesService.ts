import Status from 'App/Models/Company/Status'

export default {
  async get() {
    const statuses = await Status.query().orderBy('sequence', 'asc')

    return statuses
  },

  async detail(sequence: number) {
    const status = await Status.query().where('sequence', sequence).first()

    return status
  },
}
