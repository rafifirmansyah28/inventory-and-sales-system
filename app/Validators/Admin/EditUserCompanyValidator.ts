import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EditUserCompanyValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    email: schema.string({ trim: true }, [
      rules.maxLength(255),
      rules.email(),
      rules.normalizeEmail({ allLowercase: true }),
      rules.unique({
        table: 'users',
        column: 'email',
        caseInsensitive: true,
        whereNot: { id: this.ctx.params.user_id },
      }),
    ]),
    password: schema.string.nullableAndOptional({ trim: true }, [
      rules.minLength(8),
      rules.maxLength(255),
    ]),
    phone_number: schema.string({ trim: true }, [rules.minLength(9), rules.maxLength(13)]),
    upload_signature_image: schema.file.nullableAndOptional({
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    }),
    company_id: schema.number([rules.exists({ table: 'companies', column: 'id' })]),
    job_position: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(255)]),
  })

  public messages: CustomMessages = {
    'name.required': 'Nama wajib diisi',
    'name.maxLength': 'Nama wajib memiliki maksimal 255 karakter',
    'email.required': 'Email wajib diisi',
    'email.maxLength': 'Email wajib memiliki maksimal 255 karakter',
    'email.email': 'Format email harus sah. Contoh: contoh@gmail.com',
    'email.unique': 'Email yang anda masukan sudah digunakan. Silahkan masukan email lain',
    'password.minLength': 'Kata Sandi wajib memiliki minimal 8 karakter',
    'password.maxLength': 'Kata Sandi wajib memiliki maksimal 255 karakter',
    'phone_number.required': 'Nomor Telepon wajib diisi',
    'phone_number.minLength': 'Nomor Telepon wajib memiliki minimal 9 angka',
    'phone_number.maxLength': 'Nomor Telepon wajib memiliki maksimal 13 angka',
    'upload_signature_image.file.size': 'Unggah Gambar Tanda Tangan maksimal 2 MB',
    'upload_signature_image.file.extname':
      'Unggah Gambar Tanda Tangan wajib berformat .jpeg, .jpg, .png',
    'company_id.required': 'Perusahaan wajib dipilih',
    'company_id.exists': 'Perusahaan yang dipilih tidak tersedia',
    'job_position.required': 'Posisi Jabatan wajib diisi',
    'job_position.maxLength': 'Posisi Jabatan wajib memiliki maksimal 255 karakter',
  }
}
