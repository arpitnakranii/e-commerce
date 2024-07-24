const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import Orderitem from '#models/orderitem'
const StripesController = () => import('#controllers/stripes_controller')
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

    router
      .group(() => {
        router.delete('product/delete/:id', [ProductsController, 'deleteProduct'])
        router.put('product/update/:id', [ProductsController, 'updateProduct'])
      })
      .use(middleware.checkOwnerShip())

    router
      .group(() => {
        router.delete('product/wishlist/:id', [WishlistsController, 'deleteWishlist'])
      })
      .use(middleware.checkwishListOwnership())

    router
      .group(() => {
        router.put('product/review/update/:review_id?/:product_id?', [
          ReviewsController,
          'updateReview',
        ])
        router.delete('product/review/delete/:review_id?/:product_id?', [
          ReviewsController,
          'deleteReview',
        ])
      })
      .use(middleware.checkReviewOwnership())

    router.post('get/user', [AuthController, 'getUser'])
    router.get('get/product/:page?/:limit?', [ProductsController, 'getProduct'])
    router.get('get/single-product/:id?', [ProductsController, 'getSingleProduct'])

    router.post('category/add', [CategoriesController, 'addCategory'])
    router.put('category/update/:id?', [CategoriesController, 'updateCategory'])
    router.get('get/category/:page?/:limit?', [CategoriesController, 'getProduct'])
    router.get('get/category/:id?', [CategoriesController, 'getSignalProduct'])

    router.post('order/create', [OrderitemsController, 'createOrder'])
    router.post('order/increase-quantity/:id?', [OrderitemsController, 'increaseQuantity'])
    router.post('order/decrease-quantity/:id?', [OrderitemsController, 'decreaseQuantity'])
    router.delete('order/delete/:id?', [OrderitemsController, 'deleteOrder'])

    router.post('checkout/order', [OrdersController, 'createCheckOut'])
    router.post('checkout/update/status/:id?', [OrdersController, 'updateStatus'])
    router.get('checkout/gen-bill', [OrdersController, 'genBill'])

    router.post('product/review/:product_id?', [ReviewsController, 'createReview'])
    router.get('product/review/get/:review_id?', [ReviewsController, 'getSingleReview'])

    router.post('product/wishlist', [WishlistsController, 'addWishList'])
    router.get('product/wishlist/get', [WishlistsController, 'getAllwishList'])

    router.post('payment', [StripesController, 'createCheckout'])
  })
  .use(middleware.auth({ guards: ['api'] }))
