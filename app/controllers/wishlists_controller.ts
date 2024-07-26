import Wishlist from '#models/wishlist'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class WishlistsController {
  async addWishList({ request, auth, response }: HttpContext) {
    try {
      const data = request.only(['product_id'])

      const validate = vine.compile(
        vine.object({
          product_id: vine.number(),
        })
      )

      const verify = await validate.validate(data)

      if (verify) {
        const check = await Wishlist.query().where('product_id', data.product_id)

        if (check.length > 0) {
          return response.unprocessableEntity({
            error: 'This Product Already Added In Your Wishlist ',
          })
        }

        const wishlist = new Wishlist()
        wishlist.user_id = auth.user?.id!
        wishlist.product_id = data.product_id
        await wishlist.save()

        return {
          massage: 'Product Add in Wishlist Successfully',
        }
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async getAllWishList({ response, auth }: HttpContext) {
    try {
      const data = await Wishlist.query()
        .where('user_id', auth.user?.id!)
        .preload('productData')
        .preload('userData')

      if (!data) return { massage: 'Data Not Found' }

      return response
        .status(200)
        .json({ massage: 'Fetch Wishlist Successfully', wishlistData: data })
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
  async deleteWishlist({ params, response, auth }: HttpContext) {
    try {
      const id = params.id
      const userId = auth.user?.id
      const data = await Wishlist.query().where('id', id).first()

      if (!data) return { massage: 'Data Not Found' }

      if (data.user_id !== userId)
        return { massage: 'You do not have permission to modify this wishlist' }

      await data.delete()
      return { massage: 'Wishlist Delete Successfully' }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
}
