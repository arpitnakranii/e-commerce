import Wishlist from '#models/wishlist'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckwishListOwnershipMiddleware {
  async handle({ response, params, auth }: HttpContext, next: NextFn) {
    const userId = auth.user?.id
    const wishlistId = params.id

    if (!userId) {
      return response.unauthorized('User not authenticated')
    }

    const data = await Wishlist.query().where('id', wishlistId).first()

    if (!data) {
      return response.notFound('Product Not Found')
    }

    if (data.user_id !== userId) {
      return response.forbidden('You do not have permission to modify this wishlist')
    }
    const output = await next()
    return output
  }
}
