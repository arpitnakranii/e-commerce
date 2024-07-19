import Product from '#models/product'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import vine from '@vinejs/vine'

export default class ProductsController {
  async createProduct({ request, response, auth }: HttpContext) {
    try {
      const userData = auth.user?.$attributes
      const data = request.all()
      const featuredImage = request.file('featured_image')
      const imgs = request.files('images')
      data.featuredImage = featuredImage
      data.imgs = imgs

      console.log(data)
      const validationData = await vine.compile(
        vine.object({
          name: vine.string().minLength(3),
          price: vine.number().min(0),
          discount_price: vine.number().min(0),
          description: vine.string().minLength(10),
          total_quantity: vine.number().min(0),
          featuredImage: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png'],
          }),
          imgs: vine.array(
            vine.file({
              size: '2mb',
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

      return response.status(200).json({
        massage: 'Product Add Successfully',
        data: product,
      })
    } catch (err) {
      return response.unprocessableEntity(err)
    }
  }

  async deleteProduct({ params, response }: HttpContext) {
    const productId = params.id
    console.log(productId)
    if (productId) {
      const user = await Product.find(productId)
      console.log('hrllo')
      if (user) {
        await user.delete()
        return response.status(200).json({
          massage: 'Product Delete SuccessFully',
        })
      } else {
        return response.unprocessableEntity({ error: 'Enter valid Id in url' })
      }
    }
  }

  async updateProduct({ params, request, response }: HttpContext) {
    const productId = params.id
    console.log(productId)
    if (productId) {
      const user = await Product.find(productId)
      console.log(user)
      if (user) {
        const data = request.all()
        const featuredImage = request.file('featured_image')
        const imgs = request.files('images')
        data.featuredImage = featuredImage
        data.imgs = imgs

        console.log(data)
        const validationData = await vine.compile(
          vine.object({
            name: vine.string(),
            price: vine.number().min(0),
            discount_price: vine.number().min(0),
            description: vine.string().minLength(10),
            total_quantity: vine.number().min(0),
            featuredImage: vine.file({
              size: '2mb',
              extnames: ['jpg', 'png'],
            }),
            imgs: vine.array(
              vine.file({
                size: '2mb',
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
        await user.save()

        return response.status(200).json({
          massage: 'Product Updated Successfully',
          data: user,
        })
      } else {
        return response.unprocessableEntity({ error: 'pass valid Id in url' })
      }
    }
  }

  async getProduct({ request, response }: HttpContext) {
    const data = request.only(['page', 'limit'])

    const validate = vine.compile(
      vine.object({
        page: vine.number().min(1),
        limit: vine.number().min(1),
      })
    )

    const verify = await validate.validate(data)

    if (verify.limit && verify.page) {
      const productData = await Product.query()
        .select('*')
        .orderBy('id')
        .paginate(data.page, data.limit)

      return response.status(200).json({
        massage: 'Product Data Fetch Succesfully',
        data: productData,
      })
    }
  }

  async getSingleProduct({ params, response }: HttpContext) {
    const productId = params.id
    console.log(productId)
    if (productId) {
      const user = await Product.find(productId)
      console.log('hrllo')
      if (user) {
        return response.status(200).json({
          massage: 'Single Product SuccessFully',
          data: user,
        })
      } else {
        return response.unprocessableEntity({ error: 'Enter valid Id in url' })
      }
    }
  }
}
