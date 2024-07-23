import Review from '#models/review'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckReviewOwnershipMiddleware {
  async handle({ response, params, auth }: HttpContext, next: NextFn) {
    const userId = auth.user?.id
    const reviewId = params.review_id

    if (!userId) {
      return response.unauthorized('User not authenticated')
    }

    const data = await Review.query().where('id', reviewId).first()

    if (!data) {
      return response.notFound('Product Not Found')
    }

    if (data.user_id !== userId) {
      return response.forbidden('You do not have permission to modify this Review')
    }
    const output = await next()
    return output
  }
}
