/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const ReviewsController = () => import('#controllers/reviews_controller')
const WishlistsController = () => import('#controllers/wishlists_controller')
const OrdersController = () => import('#controllers/orders_controller')
const OrderitemsController = () => import('#controllers/orderitems_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const ProductsController = () => import('#controllers/products_controller')

router.post('auth/login', [AuthController, 'login'])
router.post('auth/register', [AuthController, 'register'])

router.get('auth/user', [AuthController, 'user']).use(middleware.auth({ guards: ['api'] }))
router.get('auth/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
router.post('auth/password/forgot', [AuthController, 'forgetPassword'])
router.get('auth/password/reset/:id/:token', [AuthController, 'resetpassword']).as('resetpassword')
router
  .group(() => {
    router.post('product/add', [ProductsController, 'createProduct'])
    router.delete('product/delete/:id', [ProductsController, 'deleteProduct'])
    router.put('product/update/:id', [ProductsController, 'updateProduct'])
    router.post('get/user', [AuthController, 'getUser'])
    router.post('get/product', [ProductsController, 'getProduct'])
    router.get('get/product/:id', [ProductsController, 'getSingleProduct'])

    router.post('caregory/add', [CategoriesController, 'addCategory'])
    router.put('caregory/update/:id', [CategoriesController, 'updateCategory'])
    router.post('get/category', [CategoriesController, 'getProduct'])
    router.get('get/category/:id', [CategoriesController, 'getSingalProduct'])

    router.post('order/create', [OrderitemsController, 'createOrder'])
    router.post('order/increse-quantity/:id', [OrderitemsController, 'increseQuantity'])
    router.post('order/decrese-quantity/:id', [OrderitemsController, 'decreseQuantity'])
    router.delete('order/delete/:id', [OrderitemsController, 'deleteOrder'])

    router.post('checkout/order', [OrdersController, 'createCheckOut'])
    router.post('checkout/update/status/:id', [OrdersController, 'updateStatus'])
    router.get('checkout/gen-biill', [OrdersController, 'genBill'])

    router.post('product/review/:product_id', [ReviewsController, 'createReview'])
    router.get('product/review/get/:review_id', [ReviewsController, 'getSingleReview'])
    router.put('product/review/update/:review_id/:product_id', [ReviewsController, 'updateReview'])
    router.delete('product/review/delete/:review_id/:product_id', [
      ReviewsController,
      'deleteReview',
    ])

    router.post('product/wishlist', [WishlistsController, 'addWishList'])
    router.get('product/wishlist/get', [WishlistsController, 'getAllwishList'])
    router.delete('product/wishlist/:id', [WishlistsController, 'deleteWishlist'])
  })
  .use(middleware.auth({ guards: ['api'] }))
