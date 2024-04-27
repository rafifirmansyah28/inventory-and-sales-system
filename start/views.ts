// Global functions for all view templating
import View from '@ioc:Adonis/Core/View'

View.global('indonesianCurrencyFormat', function (number: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(number)
})
