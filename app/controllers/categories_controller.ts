import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import vine from '@vinejs/vine'
import { cuid } from '@adonisjs/core/helpers'
import Category from '#models/category'
import { DateTime } from 'luxon'

export default class CategoriesController {
  async addCategory({ request, response }: HttpContext) {
    try {
      const data = request.all()

      const validate = vine.compile(
        vine.object({
          name: vine.string().minLength(1),
          color: vine.string().minLength(7).maxLength(7),
          img: vine.file({
            size: '1mb',
            extnames: ['jpg', 'png'],
          }),
        })
      )

      data.icon = 'icon-' + data.name.toLowerCase()
      const img = request.file('image')
      data.img = img
      const verify = await validate.validate(data)
      const filename = `${cuid()}.${img?.extname}`

      if (verify.img) {
        await img?.move(app.makePath('uploads/category images'), { name: filename })
      }

      const category = new Category()
      category.name = data.name
      category.icon = data.icon
      category.image = data.img.fileName
      category.color = data.color
      await category.save()
      return { massage: 'Category add successfully', data: data }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async updateCategory({ params, response, request }: HttpContext) {
    try {
      const id = params.id

      if (!id) {
        return response.unprocessableEntity({ error: 'Pass Valid Id is In URL' })
      }

      const getCategory = await Category.find(id)

      if (getCategory) {
        const data = request.all()
        const validate = vine.compile(
          vine.object({
            name: vine.string().minLength(1),
            color: vine.string().minLength(7).maxLength(7),
            img: vine.file({
              size: '1mb',
              extnames: ['jpg', 'png'],
            }),
          })
        )

        data.icon = 'icon-' + data.name.toLowerCase()
        const img = request.file('image')
        data.img = img
        const verify = await validate.validate(data)
        const filename = `${cuid()}.${img?.extname}`

        if (verify.img) {
          await img?.move(app.makePath('uploads/category images'), { name: filename })
        }

        getCategory.name = data.name
        getCategory.icon = data.icon
        getCategory.image = data.img.fileName
        getCategory.color = data.color
        getCategory.updatedAt = DateTime.now()

        await getCategory.save()
        return response
          .status(200)
          .json({ massage: 'Category Updated successfully', data: getCategory })
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async deleteProduct({ params, response }: HttpContext) {
    try {
      const id = params.id

      if (id) {
        const getCategory = await Category.find(id)

        if (getCategory) {
          await getCategory?.delete()
          return { massage: 'Category Deleted successfully' }
        } else {
          return response.unprocessableEntity({ error: 'plz Pass Valid id In URL' })
        }
      } else {
        return response.unprocessableEntity({ error: 'plz Pass Valid id In URL' })
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async getProduct({ response, params }: HttpContext) {
    try {
      const page = params.page
      const limit = params.limit

      if (!page || !limit) {
        return 'Pass Valid Params in URL'
      }

      const categoryData = await Category.query().select('*').paginate(page, limit)
      return response
        .status(200)
        .json({ massage: 'Category Fetch successfully', data: categoryData })
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async getSignalProduct({ params, response }: HttpContext) {
    try {
      const id = params.id

      if (id) {
        const getCategory = await Category.find(id)

        if (getCategory) {
          return response
            .status(200)
            .json({ massage: 'Signal Category Fetch successfully', data: getCategory })
        } else {
          return response.unprocessableEntity({ error: 'plz Pass Valid id In URL' })
        }
      } else {
        return response.unprocessableEntity({ error: 'plz Pass Id In URL' })
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
}
