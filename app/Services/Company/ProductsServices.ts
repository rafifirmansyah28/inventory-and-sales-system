import Utility from 'App/Helpers/Utility'
import Product from 'App/Models/Company/Product'

export default {
  async get(company_id: number) {
    const products = await Product.query()
      .select('id', 'name', 'qty', 'price', 'created_at', 'updated_at')
      .where('company_id', company_id)
      .orderBy('created_at', 'desc')

    return products
  },

  async detail(id: number) {
    const product = await Product.query().where('id', id).first()

    return product
  },

  async create(data: any) {
    // upload image and get file path
    if (data.image_binary) data.image = await Utility.uploadFile(data.image_binary)

    const product = new Product()

    product.company_id = data.company_id
    product.name = data.name
    product.qty = data.qty
    product.price = data.price
    product.image = data.image

    await product.save()

    return {
      success: 'Stok barang berhasil dibuat',
      data: product,
    }
  },

  async update(product, data: any) {
    // upload image and get file path
    if (data.image_binary) data.image = await Utility.uploadFile(data.image_binary)

    let oldImage = product.image

    product.name = data.name
    product.qty = data.qty
    product.price = data.price
    product.image = data.image

    await product.save()

    // check if has old image and new image, then remove old image
    if (oldImage && data.image_binary) Utility.removeFile(oldImage)

    return {
      success: 'Stok barang berhasil diubah',
      data: product,
    }
  },

  async list(company_id: number) {
    const products = await Product.query()
      .select('id', 'name', 'price', 'qty', 'image')
      .where('company_id', company_id)
      .andWhere('qty', '>', '0')
      .orderBy('created_at', 'desc')

    return products
  },
}
