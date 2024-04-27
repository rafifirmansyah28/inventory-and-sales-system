import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.normalizeEmail({ allLowercase: true }),
    ]),
    password: schema.string({ trim: true }),
    remember_me: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'email.required': 'Email wajib diisi',
    'email.string': 'Format email wajib karakter',
    'email.email': 'Format email harus sah. Contoh: contoh@gmail.com',
    'password.required': 'Password wajib diisi',
  }
}
