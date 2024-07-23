import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckProductOwnershipMiddleware {
  async handle({ response, params, auth }: HttpContext, next: NextFn) {
    const userId = auth.user?.id
    const productId = params.id

    if (!userId) {
      return response.unauthorized('User not authenticated')
    }

    const product = await Product.query().where('id', productId).first()

    if (!product) {
      return response.notFound('Product Not Found')
    }

    if (product.user_id !== userId) {
      return response.forbidden('You do not have permission to modify this product')
    }
    const output = await next()
    return output
  }
}
