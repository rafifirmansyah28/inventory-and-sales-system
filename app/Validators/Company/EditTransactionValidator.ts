import { schema, rules, CustomMessages, validator } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EditTransactionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = validator.reporters.api

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
  })

  public messages: CustomMessages = {
    'name.required': 'Nama wajib diisi',
    'name.maxLength': 'Nama wajib memiliki maksimal 255 karakter',
  }
}
