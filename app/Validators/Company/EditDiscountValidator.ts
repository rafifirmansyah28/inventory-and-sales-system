import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EditDiscountValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    percent: schema.number(),
  })

  public messages: CustomMessages = {
    'name.required': 'Nama wajib diisi',
    'name.maxLength': 'Nama wajib memiliki maksimal 255 karakter',
    'percent.required': 'Persentase wajib diisi',
    'percent.number': 'Persentase harus berupa angka',
  }
}
