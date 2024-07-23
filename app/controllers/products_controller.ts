import Product from '#models/product'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class ProductsController {
  async createProduct({ request, response, auth }: HttpContext) {
    try {
      const data = request.all()
      const featuredImage = request.file('featured_image')
      const imgs = request.files('images')
      data.featuredImage = featuredImage
      data.imgs = imgs

      const validationData = await vine.compile(
        vine.object({
          name: vine.string().minLength(3),
          price: vine.number().min(0),
          discount_price: vine.number().range([0, data.price]),
          description: vine.string().minLength(10),
          total_quantity: vine.number().min(0),
          category: vine.any(),
          featuredImage: vine.file({
            size: '1mb',
            extnames: ['jpg', 'png'],
          }),
          imgs: vine.array(
            vine.file({
              size: '1mb',
              extnames: ['jpg', 'png'],
            })
          ),
        })
      )

      const verifyData = await validationData.validate(data)

      const product = new Product()
      product.name = data.name
      product.slug = data.name.replaceAll(' ', '-').toLowerCase()
      product.price = data.price
      product.description = data.description
      product.discount_price = data.discount_price
      product.total_quantity = data.total_quantity
      product.user_id = await auth.user?.id!

      if (!product.user_id) {
        return { error: 'User Not Found' }
      }

      let categoryIds: number[] = []

      if (Array.isArray(verifyData.category)) {
        categoryIds = verifyData.category
      } else if (typeof verifyData.category === 'number') {
        categoryIds = [verifyData.category]
      } else {
        return response.badRequest('Category must be a number or an array of numbers.')
      }

      if (verifyData.featuredImage) {
        const featuredFileName = `${cuid()}.${featuredImage?.extname}`
        await featuredImage?.move(app.makePath('uploads/featuredImage'), {
          name: featuredFileName,
        })
        product.featured_image = featuredFileName
      }

      if (verifyData.imgs) {
        const imgList = []

        for (const img of verifyData.imgs) {
          const fileName = `${cuid()}.${featuredImage?.extname}`
          await img.move(app.makePath('uploads/Images'), {
            name: fileName,
          })

          if (img?.filePath) {
            imgList.push(fileName)
          } else {
            return response.badRequest('Error Moving Files')
          }
        }
        product.images = JSON.stringify(imgList)
      }

      await product.save()
      await product.related('catagorieData').attach(categoryIds)
      await product.load('catagorieData')
      return {
        massage: 'Product Add Successfully',
        data: product,
      }
    } catch (err) {
      return response.unprocessableEntity(err)
    }
  }

  async deleteProduct({ params, response }: HttpContext) {
    const productId = params.id

    if (!productId) {
      return { error: 'pass Id In URL' }
    }

    const user = await Product.find(productId)

    if (user) {
      await user.delete()
      return {
        massage: 'Product Delete SuccessFully',
      }
    } else {
      return response.unprocessableEntity({ error: 'Enter valid Id in url' })
    }
  }

  async updateProduct({ params, request, response }: HttpContext) {
    const productId = params.id

    if (productId) {
      return response.unprocessableEntity({ error: 'pass valid Id in url' })
    }
    const user = await Product.find(productId)

    if (user) {
      const data = request.all()
      const featuredImage = request.file('featured_image')
      const imgs = request.files('images')
      data.featuredImage = featuredImage
      data.imgs = imgs

      const validationData = vine.compile(
        vine.object({
          name: vine.string(),
          price: vine.number().min(0),
          discount_price: vine.number().min(0),
          description: vine.string().minLength(10),
          total_quantity: vine.number().min(0),
          featuredImage: vine.file({
            size: '1mb',
            extnames: ['jpg', 'png'],
          }),
          imgs: vine.array(
            vine.file({
              size: '1mb',
              extnames: ['jpg', 'png'],
            })
          ),
        })
      )

      const verifyData = await validationData.validate(data)

      user.name = data.name
      user.slug = data.name.replaceAll(' ', '-').toLowerCase()
      user.price = data.price
      user.description = data.description
      user.discount_price = data.discount_price
      user.total_quantity = data.total_quantity

      if (verifyData.featuredImage) {
        const featuredFileName = `${cuid()}.${featuredImage?.extname}`
        await featuredImage?.move(app.makePath('uploads/featuredImage'), {
          name: featuredFileName,
        })
        user.featured_image = featuredFileName
      }

      if (verifyData.imgs) {
        const imgList = []

        for (const img of verifyData.imgs) {
          const fileName = `${cuid()}.${featuredImage?.extname}`
          await img.move(app.makePath('uploads/Images'), {
            name: fileName,
          })

          if (img?.filePath) {
            imgList.push(fileName)
          } else {
            return response.badRequest('Error Moving Files')
          }
        }
        user.images = JSON.stringify(imgList)
      }

      user.updatedAt = DateTime.now()
      await user.save()

      return {
        massage: 'Product Updated Successfully',
        data: user,
      }
    }
  }

  async getProduct({ response, params }: HttpContext) {
    try {
      const page = Number(params.page)
      const limit = params.limit

      if (!page || !limit) {
        return 'Pass Valid Params in URL'
      }

      const productData = await Product.query()
        .preload('catagorieData')
        .preload('userData')
        .select('*')
        .orderBy('id')
        .paginate(page, limit)

      return {
        massage: 'Product Data Fetch Successfully',
        data: productData,
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async getSingleProduct({ params, response }: HttpContext) {
    const productId = params.id
    console.log(productId)
    if (!productId) {
      return response.unprocessableEntity({ error: 'Enter valid Id in url' })
    }

    const user = await Product.query()
      .where('id', productId)
      .preload('catagorieData')
      .preload('userData')

    if (user) {
      return {
        massage: 'Single Product Fetch SuccessFully',
        data: user,
      }
    }
  }
}
