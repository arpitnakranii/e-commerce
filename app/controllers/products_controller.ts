import Product from '#models/product'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class ProductsController {
  async create({ request, response, auth }: HttpContext) {
    try {
      const data = request.all()
      const userId = auth.user?.id
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
      product.user_id = userId!
      let categoryIds: number[] = []
      categoryIds = [verifyData.category]

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
      await product.related('catagoriesData').attach(categoryIds)
      await product.load('catagoriesData')
      return {
        massage: 'Product Add Successfully',
        data: product,
      }
    } catch (err) {
      return response.unprocessableEntity(err)
    }
  }

  async delete({ params, response, auth }: HttpContext) {
    const productId = params.id
    const userId = auth.user?.id

    const product = await Product.find(productId)

    if (!product) return { massage: 'Product Not Found' }

    if (product.user_id !== userId)
      return response.forbidden({ massage: 'You do not have permission to modify this product' })

    await product.delete()
    return { massage: 'Product Delete SuccessFully' }
  }

  async update({ params, request, response, auth }: HttpContext) {
    const productId = params.id
    const userId = auth.user?.id

    const product = await Product.find(productId)

    if (!product) return { massage: 'Product Not Found' }

    if (product.user_id !== userId)
      return response.forbidden({ massage: 'You do not have permission to modify this product' })

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

    product.name = data.name
    product.slug = data.name.replaceAll(' ', '-').toLowerCase()
    product.price = data.price
    product.description = data.description
    product.discount_price = data.discount_price
    product.total_quantity = data.total_quantity

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

    product.updatedAt = DateTime.now()
    await product.save()

    return {
      massage: 'Product Updated Successfully',
      data: product,
    }
  }

  async get({ response, request }: HttpContext) {
    try {
      const page = request.input('page') || 1
      const limit = request.input('limit') || 50
      const productData = await Product.query()
        .preload('catagoriesData')
        .preload('userData')
        .select('*')
        .orderBy('id')
        .paginate(page, limit)

      if (!productData) return { massage: 'Data Not Found' }

      return {
        massage: 'Product Data Fetch Successfully',
        data: productData,
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async getSingle({ params }: HttpContext) {
    const productId = params.id

    const product = await Product.query()
      .where('id', productId)
      .preload('userData')
      .preload('catagoriesData')
      .first()

    if (!product) return { massage: 'Data Not Found' }

    return {
      massage: 'Single Product Fetch SuccessFully',
      data: product,
    }
  }
}
