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
      const valiate = vine.compile(
        vine.object({
          name: vine.string().minLength(1),
          color: vine.string().minLength(7).maxLength(7),
          img: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png'],
          }),
        })
      )
      data.icon = 'icon-' + data.name.toLowerCase()
      const img = request.file('image')
      data.img = img
      const varify = await valiate.validate(data)
      const filename = `${cuid()}.${img?.extname}`
      if (varify.img) {
        await img?.move(app.makePath('uploads/category images'), { name: filename })
      }
      const category = new Category()
      category.name = data.name
      category.icon = data.icon
      category.image = data.img.fileName
      category.color = data.color
      await category.save()
      return response.status(200).json({ massage: 'Category add successfully', data: data })
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async updateCategory({ params, response, request }: HttpContext) {
    try {
      const id = params.id
      if (id) {
        const getuser = await Category.find(id)
        if (getuser) {
          const data = request.all()
          const valiate = vine.compile(
            vine.object({
              name: vine.string().minLength(1),
              color: vine.string().minLength(7).maxLength(7),
              img: vine.file({
                size: '2mb',
                extnames: ['jpg', 'png'],
              }),
            })
          )
          data.icon = 'icon-' + data.name.toLowerCase()
          const img = request.file('image')
          data.img = img
          const varify = await valiate.validate(data)
          const filename = `${cuid()}.${img?.extname}`
          if (varify.img) {
            await img?.move(app.makePath('uploads/category images'), { name: filename })
          }
          getuser.name = data.name
          getuser.icon = data.icon
          getuser.image = data.img.fileName
          getuser.color = data.color
          getuser.updatedAt = DateTime.now()

          await getuser.save()
          return response
            .status(200)
            .json({ massage: 'Category Updated successfully', data: getuser })
        } else {
          return response.unprocessableEntity({ error: 'Pass Valid is In URL' })
        }
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async deleteProduct({ params, response }: HttpContext) {
    try {
      const id = params.id
      if (id) {
        const getUser = await Category.find(id)
        if (getUser) {
          await getUser?.delete()
          return response.status(200).json({ massage: 'Category Deleted successfully' })
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

  async getProduct({ response, request }: HttpContext) {
    try {
      const data = request.only(['page', 'limit'])
      const page = data.page
      const limit = data.limit
      const validate = vine.compile(
        vine.object({
          page: vine.number().min(1),
          limit: vine.number().min(1),
        })
      )
      const verify = await validate.validate(data)
      if (verify.page && verify.limit) {
        const categoryData = await Category.query().select('*').paginate(page, limit)
        return response
          .status(200)
          .json({ massage: 'Category Fetch successfully', data: categoryData })
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async getSingalProduct({ params, response }: HttpContext) {
    try {
      const id = params.id
      console.log(id)
      if (id) {
        const getUser = await Category.find(id)
        if (getUser) {
          return response
            .status(200)
            .json({ massage: 'Singal Category Fetch successfully', data: getUser })
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
