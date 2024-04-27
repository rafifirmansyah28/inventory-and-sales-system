import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EditProductValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    qty: schema.number(),
    price: schema.number(),
    upload_image: schema.file.nullableAndOptional({
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    }),
  })

  public messages: CustomMessages = {
    'name.required': 'Nama wajib diisi',
    'name.maxLength': 'Nama wajib memiliki maksimal 255 karakter',
    'qty.required': 'Jumlah wajib diisi',
    'qty.number': 'Jumlah harus berupa angka',
    'price.required': 'Harga wajib diisi',
    'price.number': 'Harga harus berupa angka',
    'upload_image.file.size': 'Unggah Gambar maksimal 2 MB',
    'upload_image.file.extname': 'Unggah Gambar wajib berformat .jpeg, .jpg, .png',
  }
}
