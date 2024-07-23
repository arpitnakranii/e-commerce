import Review from '#models/review'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class ReviewsController {
  async createReview({ request, auth, params, response }: HttpContext) {
    try {
      const productId = params.product_id
      const userId = auth.user?.id

      if (!productId) {
        response.unprocessableEntity({ error: 'Please Pass Id In URL' })
      }

      const data = request.only(['rating', 'comment'])
      const validate = vine.compile(
        vine.object({
          rating: vine.number().min(1).max(5),
          comment: vine.string(),
        })
      )
      const verify = await validate.validate(data)

      if (!verify) {
        return 'validation Error'
      }

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

  async getSingleReview({ response, params }: HttpContext) {
    try {
      const reviewId = params.review_id

      if (!reviewId) {
        return response.unprocessableEntity({ error: 'Please Pass Valid Data In URl' })
      }

      const reviewData = await Review.query()
        .where('id', reviewId)
        .preload('products')
        .preload('userData')

      return { massage: 'Review Fetch Successfully', data: reviewData }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
  async updateReview({ response, params, request, auth }: HttpContext) {
    try {
      const userId = auth.user?.id
      const productId = params.product_id
      const reviewId = params.review_id

      if (!reviewId || !productId) {
        return { error: 'Pass Valid Data in URL' }
      }
      const data = request.all()

      const reviewData = await Review.query()
        .where('id', params.review_id)
        .andWhere('product_id', productId)
        .andWhere('user_id', userId!)
        .first()

      if (reviewData) {
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

          return response.status(200).json({ massage: 'Review Updated', updatedData: updatedData })
        }
      }

      return { massage: 'Review Fetch Successfully', data: reviewData }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
  async deleteReview({ response, params }: HttpContext) {
    try {
      const reviewId = params.review_id
      const productId = params.product_id

      if (!reviewId || !productId) {
        return response.unprocessableEntity({ error: 'Please Pass Valid Data In URl' })
      }

      await Review.query().where('id', reviewId).andWhere('product_id', productId).delete()

      return { massage: 'Review Delete Successfully' }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
}
