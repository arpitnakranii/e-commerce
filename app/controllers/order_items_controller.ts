import order_item from '#models/order_item'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class OrderItemsController {
  async create({ request, response, auth }: HttpContext) {
    try {
      const currentUser = await auth.user
      const UserId = currentUser?.$attributes['id']
      const data = request.only(['product', 'quantity'])

      const validate = await vine.compile(
        vine.object({
          product: vine.number(),
          quantity: vine.number().min(1),
        })
      )

      const verify = await validate.validate(data)

      if (verify.product && verify.quantity) {
        const getData = await order_item.findBy('product', data.product)
        const productData = await Product.find(data.product)

        if (getData) {
          getData.product = data.product
          getData.quantity = Number(data.quantity) + Number(getData.quantity)
          productData!.total_quantity = Number(productData?.total_quantity) - Number(data.quantity)
          getData.user = UserId

          if (productData!.total_quantity < 0)
            return response.unprocessableEntity({ error: 'Out Of Stock' })

          await getData.save()
          await productData?.save()
          return { massage: 'Order updated Successfully', data: getData }
        } else {
          const orderData = new order_item()
          orderData.product = data.product
          orderData.quantity = data.quantity
          productData!.total_quantity = Number(productData?.total_quantity) - Number(data.quantity)
          orderData.user = UserId

          if (productData!.total_quantity < 0)
            return response.unprocessableEntity({ error: 'Out Of Stock' })

          await orderData.save()
          await productData?.save()
          return response
            .status(200)
            .json({ massage: 'Order Placed Successfully', data: orderData })
        }
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
  async increaseQuantity({ params, response, request }: HttpContext) {
    const id = params.id
    const Add = request.only(['quantity'])

    const validate = vine.compile(
      vine.object({
        quantity: vine.number().min(1),
      })
    )
    const verify = await validate.validate(Add)

    if (verify.quantity) {
      const getOrderItem = await order_item
        .query()
        .where('id', id)
        .increment('quantity', Number(Add.quantity))

      if (!getOrderItem) return response.unprocessableEntity({ massage: 'Order Not Found' })

      return response
        .status(200)
        .json({ massage: 'Add Quantity SuccessFully', data: await order_item.find(id) })
    }
  }

  async decreaseQuantity({ params, request }: HttpContext) {
    const id = params.id
    const Add = request.only(['quantity'])

    const validate = vine.compile(
      vine.object({
        quantity: vine.number().min(1),
      })
    )
    const verify = await validate.validate(Add)

    if (verify.quantity) {
      const getOrderItem = await order_item.find(id)

      if (!getOrderItem) return { massage: 'Data Not Found' }

      const temp = getOrderItem.quantity
      getOrderItem.quantity = Number(getOrderItem.quantity) - Number(Add.quantity)

      if (getOrderItem.quantity < 0) {
        getOrderItem.quantity = temp
      }

      await getOrderItem.save()
      return { massage: 'Minus Quantity SuccessFully', data: getOrderItem }
    }
  }

  async delete({ params }: HttpContext) {
    const id = params.id

    const getOrderItem = await order_item.find(id)

    if (!getOrderItem) return { massage: 'Plz Enter valid Id In URL' }

    if (getOrderItem) {
      await getOrderItem.delete()
      return { massage: 'Order Delete SuccessFully', data: getOrderItem }
    }
  }
}
