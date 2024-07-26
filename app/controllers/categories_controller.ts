import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Category from '#models/category'
import { DateTime } from 'luxon'

export default class CategoriesController {
  async add({ request, response, auth }: HttpContext) {
    try {
      const data = request.all()
      const userId = auth.user?.id
      const validate = vine.compile(
        vine.object({
          name: vine.string().minLength(1),
          color: vine.string().minLength(7).maxLength(7),
        })
      )

      const verify = await validate.validate(data)

      if (verify) {
        const category = new Category()
        category.name = data.name
        category.color = data.color
        category.user_id = userId!
        await category.save()

        return { massage: 'Category add successfully', data: data }
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async update({ params, response, request, auth }: HttpContext) {
    try {
      const id = params.id
      const data = request.all()
      const userId = auth.user?.id
      const getCategory = await Category.find(id)

      const validate = vine.compile(
        vine.object({
          name: vine.string().minLength(1),
          color: vine.string().minLength(7).maxLength(7),
        })
      )
      const verify = await validate.validate(data)

      if (!getCategory) return { massage: 'Data Not Found' }

      if (getCategory.user_id !== userId)
        return response.forbidden({
          massage: 'You do not have permission to modify this category',
        })

      if (verify) {
        getCategory.name = data.name
        getCategory.color = data.color
        getCategory.updatedAt = DateTime.now()

        await getCategory.save()
        return { massage: 'Category Updated successfully', data: getCategory }
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async delete({ params, response, auth }: HttpContext) {
    try {
      const id = params.id
      const userId = auth.user?.id

      const getCategory = await Category.find(id)

      if (!getCategory) return { massage: 'Data Not Found' }

      if (getCategory.user_id !== userId)
        return response.forbidden({
          massage: 'You do not have permission to modify this category',
        })

      await getCategory?.delete()
      return { massage: 'Category Deleted successfully' }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async get({ response, request }: HttpContext) {
    try {
      const page = request.input('page') || 1
      const limit = request.input('limit') || 50
      const categoryData = await Category.query().select('*').paginate(page, limit)

      return response
        .status(200)
        .json({ massage: 'Category Fetch successfully', data: categoryData })
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async getSignal({ params, response }: HttpContext) {
    try {
      const id = params.id
      const getCategory = await Category.find(id)

      if (!getCategory) return { massage: ' Data not Found' }

      return response
        .status(200)
        .json({ massage: 'Signal Category Fetch successfully', data: getCategory })
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
}
