import type { HttpContext } from '@adonisjs/core/http'

export default class OrdersController {
  async createCheckOut({ request, response }: HttpContext) {
    try {
      const data = request.all()
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
}
