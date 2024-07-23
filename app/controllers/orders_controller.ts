import Order from '#models/order'

import Orderitem from '#models/orderitem'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class OrdersController {
  async createCheckOut({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      const userId = user?.id
      const data = request.all()
      const validate = vine.compile(
        vine.object({
          shipping_address1: vine.string(),
          shipping_address2: vine.string(),
          city: vine.string(),
          zip: vine.number().min(6),
          country: vine.string(),
          phone: vine.number().min(10),
        })
      )

      const verify = await validate.validate(data)

      if (verify) {
        const findOrder = await Orderitem.query().where('user', userId!).preload('products')

        const details = []

        for (const element of findOrder) {
          const checkData = await Order.findBy('order_item', element.id)

          if (checkData) {
            ;(checkData.shipping_address1 = data.shipping_address1),
              (checkData.shipping_address2 = data.shipping_address2),
              (checkData.city = data.city),
              (checkData.zip = data.zip),
              (checkData.country = data.country),
              (checkData.phone = data.phone),
              (checkData.total_price =
                Number(element.quantity) * Number(element.products.price) -
                Number(element.products.discount_price)),
              (checkData.user = element.user)
            await checkData.save()
            const O = await Order.query().where('user', element.user!).preload('userData').first()
            details.push(O)
          } else {
            let order = new Order()
            ;(order.order_item = element.id),
              (order.shipping_address1 = data.shipping_address1),
              (order.shipping_address2 = data.shipping_address2),
              (order.city = data.city),
              (order.zip = data.zip),
              (order.country = data.country),
              (order.phone = data.phone),
              (order.status = 'Pending'),
              (order.total_price =
                Number(element.quantity) * Number(element.products.price) -
                Number(element.products.discount_price)),
              (order.user = element.user)
            await order.save()
            details.push(order)
          }
        }
        return details
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async updateStatus({ params, response, request }: HttpContext) {
    try {
      const id = params.id
      const status = request.all()

      if (!id) {
        response.unprocessableEntity({ error: 'Pass Valid Id In URL' })
      }
      const validate = vine.compile(
        vine.object({
          status: vine.enum(['Pending', 'Completed', 'Shipped']),
        })
      )
      const verify = await validate.validate(status)

      if (verify) {
        const order = await Order.findBy('order_item', id)

        if (order) {
          order.status = status.status
          await order.save()
          return {
            massage: 'Status Updated Successfully',
            data: order,
          }
        } else {
          response.unprocessableEntity({ error: 'Pass Valid Id In URL' })
        }
      } else {
        response.unprocessableEntity({ error: 'Please Pass Id In URL' })
      }
    } catch (err) {
      response.unprocessableEntity({ error: err })
    }
  }

  async genBill({ auth }: HttpContext) {
    try {
      const id = auth.user?.id
      const billData = await Order.query()
        .where('user', id!)
        .preload('userData')
        .preload('orderDetails', (orderDetailsQuery) => {
          orderDetailsQuery.preload('products', (categoryQuery) => {
            categoryQuery.preload('catagorieData')
          })
        })

      let totalBill = 0
      for (let element of billData) {
        totalBill += Number(element.total_price)
      }

      return { data: billData, totalBill, dataCount: billData.length }
    } catch (err) {}
  }
}
