import Review from '#models/review'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class ReviewsController {
  async create({ request, auth, params, response }: HttpContext) {
    try {
      const productId = params.product_id
      const userId = auth.user?.id

      const data = request.only(['rating', 'comment'])
      const validate = vine.compile(
        vine.object({
          rating: vine.number().min(1).max(5),
          comment: vine.string(),
        })
      )
      await validate.validate(data)

      const reviewData = new Review()
      reviewData.user_id = userId!
      reviewData.product_id = productId
      reviewData.rating = data.rating
      reviewData.comment = data.comment
      await reviewData.save()

      const disData = await Review.query()
        .where('id', reviewData.id)
        .preload('products')
        .preload('userData')

      return {
        massage: 'Review created Successfully',
        data: disData,
      }
    } catch (err) {
      response.unprocessableEntity({ error: err })
    }
  }

  async getSingle({ response, params }: HttpContext) {
    try {
      const reviewId = params.review_id

      const reviewData = await Review.query()
        .where('id', reviewId)
        .preload('products')
        .preload('userData')

      return { massage: 'Review Fetch Successfully', data: reviewData }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
  async update({ response, params, request, auth }: HttpContext) {
    try {
      const userId = auth.user?.id
      const productId = params.product_id
      const reviewId = params.review_id

      const data = request.all()
      const reviewData = await Review.query()
        .where('id', reviewId)
        .andWhere('product_id', productId)
        .first()

      if (!reviewData) return { massage: 'Data Not Found' }

      if (reviewData.user_id !== userId)
        return response.forbidden({ massage: 'You do not have permission to modify this review' })

      const validate = vine.compile(
        vine.object({
          rating: vine.number().min(1).max(5),
          comment: vine.string(),
        })
      )

      const verify = await validate.validate(data)

      if (verify) {
        reviewData.rating = data.rating
        reviewData.comment = data.comment
        await reviewData.save()
        const updatedData = await Review.query()
          .where('id', params.review_id)
          .andWhere('product_id', productId)
          .andWhere('user_id', userId!)
          .preload('products')
          .preload('userData')

        return { massage: 'Review Updated', updatedData: updatedData }
      }

      return { massage: 'Review Fetch Successfully', data: reviewData }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
  async delete({ response, params, auth }: HttpContext) {
    try {
      const reviewId = params.review_id
      const productId = params.product_id
      const userId = auth.user?.id

      const reviewData = await Review.query()
        .where('id', reviewId)
        .andWhere('product_id', productId)
        .first()

      if (!reviewData) return { massage: 'Data Not Found' }

      if (reviewData?.user_id !== userId)
        return response.forbidden({ massage: 'You do not have permission to modify this review' })

      return { massage: 'Review Delete Successfully' }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
}
