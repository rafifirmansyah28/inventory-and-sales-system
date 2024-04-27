/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ response }) => {
  return response.redirect().toPath('/auth/login')
})

/**
 * Authentication
 *
 */
Route.group(() => {
  Route.get('/login', async ({ view }) => {
    return view.render('auth/login')
  })
  Route.post('/login', 'AuthController.login')
  Route.get('/logout-admin', 'AuthController.logoutAdmin')
  Route.get('/logout-company', 'AuthController.logoutCompany')
}).prefix('/auth')

/**
 * Admin
 *
 */
Route.group(() => {
  // Route.get('/', async ({ view }) => {
  //   return view.render('admin/index')
  // }).as('admin.index')
  Route.get('/', 'Admin/DashboardController.index').as('admin.index')
  // Companies
  Route.group(() => {
    // Views
    Route.get('/create', 'Admin/CompaniesController.create').as('companies.create')
    Route.get('/list', 'Admin/CompaniesController.list').as('companies.list')
    Route.get('/:id/edit', 'Admin/CompaniesController.edit').as('companies.edit')

    // Controller
    Route.post('/', 'Admin/CompaniesController.store').as('companies.store')
    Route.put('/:id', 'Admin/CompaniesController.update').as('companies.update')
    Route.delete('/:id', 'Admin/CompaniesController.delete').as('companies.delete')
  }).prefix('/companies')

  // User Companies
  Route.group(() => {
    // Views
    Route.get('/create', 'Admin/UserCompaniesController.create').as('user_companies.create')
    Route.get('/list', 'Admin/UserCompaniesController.list').as('user_companies.list')
    Route.get('/:user_id/edit', 'Admin/UserCompaniesController.edit').as('user_companies.edit')

    // Controller
    Route.post('/', 'Admin/UserCompaniesController.store').as('user_companies.store')
    Route.put('/:user_id', 'Admin/UserCompaniesController.update').as('user_companies.update')
    Route.delete('/:user_id', 'Admin/UserCompaniesController.delete').as('user_companies.delete')
  }).prefix('/user-companies')

  // Clients
  Route.group(() => {
    // Views
    Route.get('/create', 'Admin/ClientsController.create').as('clients.create')
    Route.get('/list', 'Admin/ClientsController.list').as('clients.list')
    Route.get('/:id/edit', 'Admin/ClientsController.edit').as('clients.edit')

    // Controller
    Route.post('/', 'Admin/ClientsController.store').as('clients.store')
    Route.put('/:id', 'Admin/ClientsController.update').as('clients.update')
    Route.delete('/:id', 'Admin/ClientsController.delete').as('clients.delete')
  }).prefix('/clients')

  // Client Stackholders
  Route.group(() => {
    // Views
    Route.get('/create', 'Admin/ClientStackholdersController.create').as(
      'client_stackholders.create'
    )
    Route.get('/list', 'Admin/ClientStackholdersController.list').as('client_stackholders.list')
    Route.get('/:id/edit', 'Admin/ClientStackholdersController.edit').as('client_stackholders.edit')

    // Controller
    Route.post('/', 'Admin/ClientStackholdersController.store').as('client_stackholders.store')
    Route.put('/:id', 'Admin/ClientStackholdersController.update').as('client_stackholders.update')
    Route.delete('/:id', 'Admin/ClientStackholdersController.delete').as(
      'client_stackholders.delete'
    )
  }).prefix('/client-stackholders')
})
  .prefix('/admin')
  .middleware(['auth:admin', 'LogAction'])

/**
 * Company
 *
 */
Route.group(() => {
  // Route.get('/', async ({ view }) => {
  //   return view.render('company/index')
  // }).as('company.index')
  Route.get('/', 'Company/DashboardController.index')
    .as('company.index')
    .middleware('FindCompanyOfUser')

  // Products
  Route.group(() => {
    // Views
    Route.get('/create', 'Company/ProductsController.create').as('products.create')
    Route.get('/list', 'Company/ProductsController.list')
      .as('products.list')
      .middleware('FindCompanyOfUser')
    Route.get('/:id/edit', 'Company/ProductsController.edit').as('products.edit')

    // Controller
    Route.post('/', 'Company/ProductsController.store')
      .as('products.store')
      .middleware('FindCompanyOfUser')
    Route.put('/:id', 'Company/ProductsController.update').as('products.update')
    Route.delete('/:id', 'Company/ProductsController.delete').as('products.delete')
  }).prefix('/products')

  // Discounts
  Route.group(() => {
    // Views
    Route.get('/create', 'Company/DiscountsController.create').as('discounts.create')
    Route.get('/list', 'Company/DiscountsController.list')
      .as('discounts.list')
      .middleware('FindCompanyOfUser')
    Route.get('/:id/edit', 'Company/DiscountsController.edit').as('discounts.edit')

    // Controller
    Route.post('/', 'Company/DiscountsController.store')
      .as('discounts.store')
      .middleware('FindCompanyOfUser')
    Route.put('/:id', 'Company/DiscountsController.update').as('discounts.update')
    Route.delete('/:id', 'Company/DiscountsController.delete').as('discounts.delete')
  }).prefix('/discounts')

  // Transactions
  Route.group(() => {
    // Views
    Route.get('/create', 'Company/TransactionsController.create')
      .as('transactions.create')
      .middleware('FindCompanyOfUser')
    Route.get('/list', 'Company/TransactionsController.list')
      .as('transactions.list')
      .middleware('FindCompanyOfUser')
    Route.get('/status/list', 'Company/StatusesController.list').as('masterStatuses.list')
    Route.delete('/:id', 'Company/TransactionsController.delete').as('transactions.delete')
  }).prefix('/transactions')
})
  .prefix('/company')
  .middleware(['auth:web', 'LogAction'])

/**
 * API
 *
 */
Route.group(() => {
  Route.get('/companies/list', 'Admin/CompaniesController.apiList')
  Route.get('/user-companies/:company_id/list', 'Admin/UserCompaniesController.getUsersFromCompany')
  Route.get('/clients/list', 'Admin/ClientsController.apiList')
  Route.get(
    '/client-stackholders/:client_id/list',
    'Admin/clientStackholdersController.getStackholdersOfClient'
  )
  Route.get('/companies/:company_id/product-list', 'Company/ProductsController.productList')
  Route.post('/companies/:company_id/order', 'Company/OrdersController.process')
  Route.get('/companies/:company_id/order', 'Company/OrdersController.list')

  Route.put('/companies/:company_id/transactions/:id', 'Company/TransactionsController.update').as(
    'transactions.update'
  )
  Route.get('/companies/:company_id/revenue', 'Company/DashboardController.revenue')
  Route.get(
    '/companies/:company_id/best-seller-products',
    'Company/DashboardController.bestSellerProducts'
  )
}).prefix('/api')

// Test Redis
import Redis from '@ioc:Adonis/Addons/Redis'

Route.get('/test-redis', async ({ response }) => {
  const key = 'testing-keyy'

  await Redis.set(key, 100)

  const found = await Redis.get(key)

  return response.json({
    success: 'Redis berhasil didapatkan',
    data: found,
  })
})

Route.group(() => {
  Route.get('/invoice', async ({ view }) => {
    return view.render('attachment/invoice')
  })
  Route.get('/order-letter', async ({ view }) => {
    return view.render('attachment/order_letter')
  })
  Route.get('/payment-receipt', async ({ view }) => {
    return view.render('attachment/payment_receipt')
  })
  Route.get('/record-of-transfer', async ({ view }) => {
    return view.render('attachment/record_of_transfer')
  })
  Route.get('/main', async ({ view }) => {
    return view.render('layouts/attachment/main')
  })
}).prefix('/attachment')
