import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import sharp from 'sharp'
import { DateTime } from 'luxon'
import Logger from '@ioc:Adonis/Core/Logger'
import fs from 'node:fs'
// import Env from '@ioc:Adonis/Core/Env'

const PUBLIC_PATH = Env.get('STORE_IN_ROOT_PROJECT')
  ? `${Application.appRoot}/../public/`
  : Application.publicPath('/')

const Utility = {
  async uploadFile(file: any) {
    // file name = unix timestamp + extension file
    const fileName = `${Math.floor(Date.now())}.${file.extname}`
    const filePath = `uploads/${fileName}`

    // Store to file system
    await sharp(file.tmpPath).toFile(`${PUBLIC_PATH}/${filePath}`)

    // return file path
    return filePath
  },
  removeFile(filePath: string) {
    fs.unlink(`${PUBLIC_PATH}/${filePath}`, (error) => {
      if (error) {
        this.logging(
          `Failed to run ${this.getCurrentFunction()} in ${this.getCurrentFile(__filename)}`,
          arguments,
          error.message,
          'error'
        )
      }
    })
  },

  // publicPath(filePath) {
  //   if (Env.get('NODE_ENV') === 'production') {
  //     return `${Application.appRoot}/build/public/${filePath}`
  //   } else {
  //     return Application.publicPath(filePath)
  //   }
  // },

  dateTimeFormat(time: any) {
    return DateTime.fromJSDate(time).setLocale('id').toFormat('d MMM yyyy')
  },

  orderNumberList: {
    'Kwitansi Pembayaran': 'KW',
    'Berita Acara Serah Terima': 'BAST',
    'Surat Pesanan': 'SP',
    'Invoice': 'INV',
  },

  /** Logs */
  getCurrentFunction() {
    const obj: any = {}

    Error.captureStackTrace(obj, this.getCurrentFunction)

    const { stack } = obj
    const splitted = stack.split(' ')

    return splitted[6]
  },
  getCurrentFile(path: string, lastXElement: number = 2) {
    const delimiter = '/'
    const splitted = path.split(delimiter)
    const extracted = splitted.slice(-lastXElement)

    return extracted.join(delimiter)
  },
  logging(subject: string, payload: object | any[], message: string, type: string = 'info') {
    Logger[type]({
      datetime: new Date().toLocaleString(),
      subject,
      message,
      payload,
    })
  },
  catchError(request, response, error, returnBack = true) {
    const message = error?.messages?.errors[0]?.message ?? error?.message ?? error?.error

    this.logging(
      `Query failed on ${request.method()} ${request.url()}`,
      request.all(),
      message,
      'error'
    )

    // response back if needed
    if (returnBack) return response.json({ error: message })
  },
}

export default Utility
