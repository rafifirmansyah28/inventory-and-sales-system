import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const LENGTH_NPSN = 8
const MIN_LENGTH_NPWP = 15
const MAX_LENGTH_NPWP = 16

export default class EditClientValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    address: schema.string({ trim: true }),
    npsn: schema.string({ trim: true }, [
      rules.minLength(LENGTH_NPSN),
      rules.maxLength(LENGTH_NPSN),
    ]),
    npwp: schema.string({ trim: true }, [
      rules.minLength(MIN_LENGTH_NPWP),
      rules.maxLength(MAX_LENGTH_NPWP),
    ]),
  })

  public messages: CustomMessages = {
    'name.required': 'Nama wajib diisi',
    'name.maxLength': 'Nama wajib memiliki maksimal 255 karakter',
    'address.required': 'Alamat wajib diisi',
    'npsn.required': 'NPSN wajib diisi',
    'npsn.minLength': `NPSN wajib memiliki panjang ${LENGTH_NPSN} karakter`,
    'npsn.maxLength': `NPSN wajib memiliki panjang ${LENGTH_NPSN} karakter`,
    'npwp.required': 'NPWP wajib diisi',
    'npwp.minLength': `NPWP wajib memiliki panjang karakter ${MIN_LENGTH_NPWP} - ${MAX_LENGTH_NPWP}`,
    'npwp.maxLength': `NPWP wajib memiliki panjang karakter ${MIN_LENGTH_NPWP} - ${MAX_LENGTH_NPWP}`,
  }
}
