import { schema, rules, CustomMessages, validator } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateCompanyOrderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = validator.reporters.api

  public schema = schema.create({
    general_information: schema.object().members({
      sk_number: schema.string({ trim: true }, [rules.maxLength(255)]),
      order_name: schema.string({ trim: true }, [rules.maxLength(255)]),
      client_id: schema.number(),
      client_name: schema.string({ trim: true }, [rules.maxLength(255)]),
      stackholder_id: schema.number(),
      stackholder_name: schema.string({ trim: true }, [rules.maxLength(255)]),
      // order_date: schema.date({ format: 'dd LLLL yyyy' }),
      company_id: schema.number(),
      company_name: schema.string({ trim: true }, [rules.maxLength(255)]),
      user_id: schema.number(),
      user_name: schema.string({ trim: true }, [rules.maxLength(255)]),
    }),
    order_cart: schema.array().members(
      schema.object().members({
        product_id: schema.number(),
        product_name: schema.string({ trim: true }, [rules.maxLength(255)]),
        product_price: schema.number(),
        product_qty: schema.number(),
        product_image: schema.string({ trim: true }),
        total_product_price: schema.number(),
      })
    ),
    order_summary: schema.object().members({
      discount_id: schema.number.nullableAndOptional(),
      discount_percent: schema.number.nullableAndOptional(),
      sub_total: schema.number(),
      grand_total: schema.number(),
    }),
  })

  public messages: CustomMessages = {
    'general_information.sk_number.required': 'Nomor SK wajib diisi',
    'general_information.sk_number.maxLength': 'Nomor SK wajib memiliki maksimal 255 karakter',
    'general_information.order_name.required': 'Nama Pesanan wajib diisi',
    'general_information.order_name.maxLength': 'Nama Pesanan wajib memiliki maksimal 255 karakter',
    'general_information.client_id.required': 'Id Satuan Pendidikan wajib diisi',
    'general_information.client_id.number': 'Id Satuan Pendidikan wajib berupa angka',
    'general_information.client_name.required': 'Nama Satuan Pendidikan wajib diisi',
    'general_information.client_name.maxLength':
      'Nama Satuan Pendidikan wajib memiliki maksimal 255 karakter',
    'general_information.stackholder_id.required': 'Id Nama Pemesan wajib diisi',
    'general_information.stackholder_id.number': 'Id Nama Pemesan wajib berupa angka',
    'general_information.stackholder_name.required': 'Nama dari Nama Pemesan wajib diisi',
    'general_information.stackholder_name.maxLength':
      'Nama dari Nama Pemesan wajib memiliki maksimal 255 karakter',
    // 'general_information.order_date.required': 'Tanggal Pesanan wajib diisi',
    // 'general_information.order_date.date': 'Tanggal Pesanan wajib berupa tanggal',
    // 'general_information.order_date.date.format':
    //   'Format Tanggal Pesanan wajib dd dd LLLL yyyy, contoh 01 Maret 2024',
    'order_cart.*.product_id.required': 'Id Barang wajib diisi',
    'order_cart.*.product_id.number': 'Id Barang wajib berupa angka',
    'order_cart.*.product_name.required': 'Nama Barang wajib diisi',
    'order_cart.*.product_name.maxLength': 'Nama Barang wajib memiliki maksimal 255 karakter',
    'order_cart.*.product_price.required': 'Harga Barang wajib diisi',
    'order_cart.*.product_price.number': 'Harga Barang wajib berupa angka',
    'order_cart.*.product_qty.required': 'Jumlah Barang wajib diisi',
    'order_cart.*.product_qty.number': 'Jumlah Barang wajib berupa angka',
    'order_cart.*.product_image.required': 'Gambar barang wajib diisi',
    'order_cart.*.total_product_price.required': 'Total Harga Barang wajib diisi',
    'order_cart.*.total_product_price.number': 'Total Harga Barang wajib berupa angka',
    'order_summary.*.discount_id.number': 'Id Diskon wajib berupa angka',
    'order_summary.*.discount_percent.number': 'Persentase Diskon wajib berupa angka',
    'order_cart.*.sub_total.required': 'Sub Total Pesanan wajib diisi',
    'order_cart.*.sub_total.number': 'Sub Total Pesanan wajib berupa angka',
    'order_cart.*.grand_total.required': 'Grand Total Pesanan wajib diisi',
    'order_cart.*.grand_total.number': 'Grand Total Pesanan wajib berupa angka',
    'general_information.user_id.required': 'Id Admin Perusahaan wajib diisi',
    'general_information.user_id.number': 'Id Admin Perusahaan wajib berupa angka',
    'general_information.user_name.required': 'Nama Admin Perusahaan wajib diisi',
    'general_information.user_name.maxLength':
      'Nama Admin Perusahaan wajib memiliki maksimal 255 karakter',
    'general_information.company_id.required': 'Id Perusahaan wajib diisi',
    'general_information.company_id.number': 'Id Perusahaan wajib berupa angka',
    'general_information.company_name.required': 'Nama Perusahaan wajib diisi',
    'general_information.company_name.maxLength':
      'Nama Perusahaan wajib memiliki maksimal 255 karakter',
  }
}
