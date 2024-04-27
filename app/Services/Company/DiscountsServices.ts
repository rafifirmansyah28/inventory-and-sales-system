import Discount from 'App/Models/Company/Discount'

export default {
  async get(company_id) {
    const discounts = Discount.query()
      .select('id', 'name', 'percent', 'created_at', 'updated_at')
      .where('company_id', company_id)
      .orderBy('created_at', 'desc')

    return discounts
  },

  async create(data) {
    const discount = new Discount()

    discount.company_id = data.company_id
    discount.name = data.name
    discount.percent = data.percent

    await discount.save()

    return {
      success: 'Diskon barang berhasil dibuat',
      data: discount,
    }
  },

  async detail(id: number) {
    const discount = await Discount.query().select('*').where('id', id).first()

    return discount
  },

  async update(discount, data: any) {
    discount.name = data.name
    discount.percent = data.percent

    await discount.save()

    return {
      success: 'Diskon barang berhasil diubah',
      data: discount,
    }
  },
}
