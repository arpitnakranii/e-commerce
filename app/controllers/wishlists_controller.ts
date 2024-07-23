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
        console.log(check)
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

  async getAllwishList({ response, auth }: HttpContext) {
    try {
      const data = await Wishlist.query()
        .where('user_id', auth.user?.id!)
        .preload('productData')
        .preload('userData')

      if (data) {
        return response
          .status(200)
          .json({ massage: 'Fetch Wishlist Successfully', wishlistData: data })
      } else {
        return response.unprocessableEntity({ error: 'empty' })
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
  async deleteWishlist({ params, response }: HttpContext) {
    try {
      if (!params.id) {
        return response.unprocessableEntity({ error: 'Pass Id in URl' })
      }

      const data = await Wishlist.query().where('id', params.id).first()

      if (data) {
        await data.delete()
        return { massage: 'Wishlist Delete Successfully' }
      } else {
        return response.unprocessableEntity({ error: 'Data Not Found Please Pass Valid Id' })
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
}
