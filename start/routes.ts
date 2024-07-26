const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const StripesController = () => import('#controllers/stripes_controller')
const ReviewsController = () => import('#controllers/reviews_controller')
const WishlistsController = () => import('#controllers/wishlists_controller')
const OrdersController = () => import('#controllers/orders_controller')
const OrderItemsController = () => import('#controllers/order_items_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const ProductsController = () => import('#controllers/products_controller')

router.post('auth/login', [AuthController, 'login'])
router.post('auth/register', [AuthController, 'register'])
router.get('auth/user', [AuthController, 'user']).use(middleware.auth({ guards: ['api'] }))
router.get('auth/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
router.post('auth/password/forgot', [AuthController, 'forgetPassword'])
router.get('auth/password/reset/:id/:token', [AuthController, 'resetpassword']).as('resetpassword')
router.get('payment', [StripesController, 'getPaymentData'])
router
  .group(() => {
    router.post('product/add', [ProductsController, 'create'])
    router.delete('product/delete/:id', [ProductsController, 'delete'])
    router.put('product/update/:id', [ProductsController, 'update'])
    router.get('product/', [ProductsController, 'get'])
    router.get('product/:id', [ProductsController, 'getSingle'])

    router.get('get/user', [AuthController, 'getUser'])

    router.post('category/add', [CategoriesController, 'add'])
    router.delete('category/delete/:id', [CategoriesController, 'delete'])
    router.put('category/update/:id', [CategoriesController, 'update'])
    router.get('category', [CategoriesController, 'get'])
    router.get('category/:id', [CategoriesController, 'getSignal'])

    router.post('order/create', [OrderItemsController, 'create'])
    router.post('order/increase-quantity/:id', [OrderItemsController, 'increaseQuantity'])
    router.post('order/decrease-quantity/:id', [OrderItemsController, 'decreaseQuantity'])
    router.delete('order/delete/:id', [OrderItemsController, 'delete'])

    router.post('checkout/order', [OrdersController, 'createCheckOut'])
    router.post('checkout/update/status/:id', [OrdersController, 'updateStatus'])
    router.get('checkout/gen-bill', [OrdersController, 'genBill'])

    router.post('product/review/:product_id', [ReviewsController, 'create'])
    router.get('product/review/get/:review_id', [ReviewsController, 'getSingle'])
    router.put('product/review/update/:review_id/:product_id', [ReviewsController, 'update'])
    router.delete('product/review/delete/:review_id/:product_id', [ReviewsController, 'delete'])

    router.post('product/wishlist', [WishlistsController, 'addWishList'])
    router.get('product/wishlist/get', [WishlistsController, 'getAllWishList'])
    router.delete('product/wishlist/delete/:id', [WishlistsController, 'deleteWishlist'])

    router.post('payment', [StripesController, 'createCheckout'])
  })
  .use(middleware.auth({ guards: ['api'] }))
