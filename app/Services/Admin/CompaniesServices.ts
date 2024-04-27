import Utility from 'App/Helpers/Utility'
import Company from 'App/Models/Admin/Company'

export default {
  async get() {
    const companies = await Company.query()
      .select('id', 'name', 'email', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc')

    return companies
  },

  async detail(id: number) {
    const company = await Company.query().where('id', id).first()

    return company
  },

  async create(data: any) {
    // upload stamp image and get file path
    if (data.stamp_image_binary)
      data.stamp_image = await Utility.uploadFile(data.stamp_image_binary)

    const company = new Company()

    company.name = data.name
    company.email = data.email
    company.address = data.address
    company.bank_name = data.bank_name
    company.bank_account_number = data.bank_account_number
    company.stamp_image = data.stamp_image
    company.bank_branch = data.bank_branch
    company.npwp = data.npwp
    company.pph = data.pph
    company.ppn = data.ppn

    await company.save()

    return {
      success: 'Perusahaan berhasil dibuat',
      data: company,
    }
  },

  async update(company, data: any) {
    // upload stamp image and get file path
    if (data.stamp_image_binary)
      data.stamp_image = await Utility.uploadFile(data.stamp_image_binary)

    let oldStampImage = company.stamp_image

    company.name = data.name
    company.email = data.email
    company.address = data.address
    company.bank_name = data.bank_name
    company.bank_account_number = data.bank_account_number
    company.stamp_image = data.stamp_image
    company.bank_branch = data.bank_branch
    company.npwp = data.npwp
    company.pph = data.pph
    company.ppn = data.ppn

    await company.save()

    // check if has old stamp image and new stamp image, then remove old stamp image
    if (oldStampImage && data.stamp_image_binary) Utility.removeFile(oldStampImage)

    return {
      success: 'Perusahaan berhasil diubah',
      data: company,
    }
  },
}
