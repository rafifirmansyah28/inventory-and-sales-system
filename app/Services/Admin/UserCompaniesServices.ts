import Utility from 'App/Helpers/Utility'
import UserCompany from 'App/Models/Admin/UserCompany'
import User from 'App/Models/Admin/User'

export default {
  async get() {
    const userCompanies = await UserCompany.query()
      .select(
        'id',
        'user_id',
        'company_id',
        'phone_number',
        'job_position',
        'created_at',
        'updated_at'
      )
      .preload('user', (user) => user.select('id', 'name'))
      .preload('company', (company) => company.select('id', 'name'))
      .orderBy('created_at', 'desc')

    return userCompanies
  },

  async create(data: any, trx: any) {
    // create user first
    const user = new User()

    user.name = data.name
    user.email = data.email
    user.password = data.password

    await user.useTransaction(trx).save()

    // upload signature image and get file path
    if (data.signature_image_binary)
      data.signature_image = await Utility.uploadFile(data.signature_image_binary)

    const userCompany = new UserCompany()

    userCompany.user_id = user.id
    userCompany.company_id = data.company_id
    userCompany.phone_number = data.phone_number
    userCompany.job_position = data.job_position
    userCompany.signature_image = data.signature_image

    await userCompany.useTransaction(trx).save()

    return {
      success: 'Pengguna perusahaan berhasil dibuat',
      data: { user, userCompany },
    }
  },

  async detail(userId: number) {
    const user = await User.query()
      .preload('userCompany', (userCompany) => userCompany.select('*'))
      .where('id', userId)
      .first()

    return user
  },

  async detailPivot(userId: number) {
    const userCompany = await UserCompany.query().where('user_id', userId).first()

    return userCompany
  },

  async update(user, userCompany, data: any, trx: any) {
    // upload signature image and get file path
    if (data.signature_image_binary)
      data.signature_image = await Utility.uploadFile(data.signature_image_binary)

    let oldSignatureImage = user.userCompany.signature_image

    user.name = data.name
    user.email = data.email
    if (data.password) user.password = data.password

    userCompany.company_id = data.company_id
    userCompany.phone_number = data.phone_number
    userCompany.job_position = data.job_position
    userCompany.signature_image = data.signature_image

    await user.useTransaction(trx).save()
    await userCompany.useTransaction(trx).save()

    // check if has old signature image and new signature image, then remove old signature image
    if (data.signature_image_binary && oldSignatureImage) Utility.removeFile(oldSignatureImage)

    return {
      success: 'Pengguna perusahaan berhasil diubah',
      data: user,
    }
  },

  async usersFromCompany(company_id: number) {
    const usersCompany = await UserCompany.query()
      .select('id', 'user_id', 'company_id', 'job_position')
      .preload('user')
      .where('company_id', company_id)

    return usersCompany
  },
}
