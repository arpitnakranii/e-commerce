/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
import auth from '@adonisjs/auth/services/main'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const ProductsController = () => import('#controllers/products_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('auth/login', [AuthController, 'login'])
router.post('auth/register', [AuthController, 'register'])

router.get('auth/user', [AuthController, 'user']).use(middleware.auth({ guards: ['api'] }))
router.get('auth/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
router.post('auth/password/forgot', [AuthController, 'forgetPassword'])
router.post('auth/password/reset/:id/:token', [AuthController, 'resetpassword']).as('resetpassword')
router
  .group(() => {
    router.post('product/add', [ProductsController, 'createProduct'])
    router.delete('product/delete/:id', [ProductsController, 'deleteProduct'])
    router.put('product/update/:id', [ProductsController, 'updateProduct'])
    router.post('get/user', [AuthController, 'getUser'])
    router.post('get/product', [ProductsController, 'getProduct'])
    router.get('get/product/:id', [ProductsController, 'getSingleProduct'])
  })
  .use(middleware.auth({ guards: ['api'] }))
