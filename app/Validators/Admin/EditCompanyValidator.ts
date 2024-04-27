import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const MIN_LENGTH_NPWP = 15
const MAX_LENGTH_NPWP = 16
const MIN_LENGTH_PPN = 1
const MAX_LENGTH_PPN = 100
const MIN_LENGTH_PPH = 1
const MAX_LENGTH_PPH = 100

export default class CreateCompanyValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    email: schema.string({ trim: true }, [
      rules.maxLength(255),
      rules.email(),
      rules.normalizeEmail({ allLowercase: true }),
      rules.unique({
        table: 'companies',
        column: 'email',
        caseInsensitive: true,
        whereNot: { id: this.ctx.params.id },
      }),
    ]),
    address: schema.string({ trim: true }),
    upload_stamp_image: schema.file.nullableAndOptional({
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    }),
    bank_name: schema.string({ trim: true }, [rules.maxLength(255)]),
    bank_account_number: schema.number(),
    bank_branch: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(255)]),
    npwp: schema.string({ trim: true }, [
      rules.minLength(MIN_LENGTH_NPWP),
      rules.maxLength(MAX_LENGTH_NPWP),
    ]),
    ppn: schema.number([rules.range(MIN_LENGTH_PPN, MAX_LENGTH_PPN)]),
    pph: schema.number([rules.range(MIN_LENGTH_PPH, MAX_LENGTH_PPH)]),
  })

  public messages: CustomMessages = {
    'name.required': 'Nama wajib diisi',
    'name.maxLength': 'Nama wajib memiliki maksimal 255 karakter',
    'email.required': 'Email wajib diisi',
    'email.maxLength': 'Email wajib memiliki maksimal 255 karakter',
    'email.email': 'Format email harus sah. Contoh: contoh@gmail.com',
    'email.unique': 'Email yang anda masukan sudah digunakan. Silahkan masukan email lain',
    'address.required': 'Alamat wajib diisi',
    'upload_stamp_image.file':
      'Unggah Gambar Stempel maksimal 2mb dan harus berformat .jpeg, .jpg, .png',
    'bank_name.required': 'Nama Bank wajib diisi',
    'bank_name.maxLength': 'Nama Bank wajib memiliki maksimal 255 karakter',
    'bank_account_number.required': 'No. Rekening Bank wajib diisi',
    'bank_account_number.number': 'No. Rekening Bank wajib mengandung angka',
    'bank_branch.maxLength': 'Bank Cabang wajib memiliki maksimal 255 karakter',
    'npwp.required': 'NPWP wajib diisi',
    'npwp.minLength': `NPWP wajib memiliki panjang karakter ${MIN_LENGTH_NPWP} - ${MAX_LENGTH_NPWP}`,
    'npwp.maxLength': `NPWP wajib memiliki panjang karakter ${MIN_LENGTH_NPWP} - ${MAX_LENGTH_NPWP}`,
    'ppn.required': 'PPN wajib diisi',
    'ppn.number': 'PPN wajib mengandung angka',
    'ppn.range': `PPN wajib memiliki panjang karakter ${MIN_LENGTH_PPN} - ${MAX_LENGTH_PPN}`,
    'pph.required': 'PPH wajib diisi',
    'pph.number': 'PPH wajib mengandung angka',
    'pph.range': `PPH wajib memiliki panjang karakter ${MIN_LENGTH_PPH} - ${MAX_LENGTH_PPH}`,
  }
}
