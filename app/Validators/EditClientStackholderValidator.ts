import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const LENGTH_NIP = 18

export default class CreateClientStackholderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    nip: schema.string({ trim: true }, [rules.minLength(LENGTH_NIP), rules.maxLength(LENGTH_NIP)]),
    phone_number: schema.string({ trim: true }, [rules.minLength(9), rules.maxLength(13)]),
    job_position: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(255)]),
    client_id: schema.number([rules.exists({ table: 'clients', column: 'id' })]),
  })

  public messages: CustomMessages = {
    'name.required': 'Nama pemangku jabatan wajib diisi',
    'name.maxLength': 'Nama pemangku jabatan wajib memiliki maksimal 255 karakter',
    'nip.required': 'NIP wajib diisi',
    'nip.minLength': `NIP wajib memiliki panjang ${LENGTH_NIP} karakter`,
    'nip.maxLength': `NIP wajib memiliki panjang ${LENGTH_NIP} karakter`,
    'phone_number.required': 'Nomor Telepon wajib diisi',
    'phone_number.minLength': 'Nomor Telepon wajib memiliki minimal 9 angka',
    'phone_number.maxLength': 'Nomor Telepon wajib memiliki maksimal 13 angka',
    'job_position.maxLength': 'Posisi Jabatan wajib memiliki maksimal 255 karakter',
    'client_id.required': 'Klien wajib dipilih',
    'client_id.exists': 'Klien yang dipilih tidak tersedia',
  }
}
