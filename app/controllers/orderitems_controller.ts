import Orderitem from '#models/orderitem'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class OrderitemsController {
  async createOrder({ request, response, auth }: HttpContext) {
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
      console.log(UserId)
      const verify = await validate.validate(data)
      if (verify.product && verify.quantity) {
        const getData = await Orderitem.findBy('product', data.product)
        const productData = await Product.find(data.product)
        if (getData) {
          getData.product = data.product
          console.log(typeof getData.quantity)
          getData.quantity = Number(data.quantity) + Number(getData.quantity)
          productData!.total_quantity = Number(productData?.total_quantity) - Number(data.quantity)
          getData.user = UserId
          if (productData!.total_quantity < 0)
            return response.unprocessableEntity({ error: 'Out Of Stock' })
          await getData.save()
          await productData?.save()
          return response.status(200).json({ massage: 'Order updated Succesfully', data: getData })
        } else {
          const orderData = new Orderitem()
          orderData.product = data.product
          orderData.quantity = data.quantity
          productData!.total_quantity = Number(productData?.total_quantity) - Number(data.quantity)
          orderData.user = UserId
          if (productData!.total_quantity < 0)
            return response.unprocessableEntity({ error: 'Out Of Stock' })
          await orderData.save()
          await productData?.save()
          return response.status(200).json({ massage: 'Order Placed Succesfully', data: orderData })
        }
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
  async increseQuantity({ params, response, request }: HttpContext) {
    const id = params.id
    const Add = request.only(['quantity'])
    const validate = vine.compile(
      vine.object({
        quantity: vine.number().min(1),
      })
    )
    const verify = await validate.validate(Add)
    if (verify.quantity && id) {
      const getUser = await Orderitem.query()
        .where('id', id)
        .increment('quantity', Number(Add.quantity))
      if (getUser) {
        return response
          .status(200)
          .json({ massage: 'Add Quantity SuccessFully', data: await Orderitem.find(id) })
      } else {
        return response.unprocessableEntity({ massage: 'Order Not Found' })
      }
    } else {
      return response.unprocessableEntity({ error: 'Unknow URL' })
    }
  }

  async decreseQuantity({ params, response, request }: HttpContext) {
    const id = params.id
    const Add = request.only(['quantity'])
    const validate = vine.compile(
      vine.object({
        quantity: vine.number().min(1),
      })
    )
    const verify = await validate.validate(Add)
    if (verify.quantity && id) {
      const getUser = await Orderitem.find(id)
      if (getUser) {
        const temp = getUser.quantity
        getUser.quantity = Number(getUser.quantity) - Number(Add.quantity)
        if (getUser.quantity < 0) {
          getUser.quantity = temp
        }
        await getUser.save()
        return response.status(200).json({ massage: 'Minus Quantity SuccessFully', data: getUser })
      } else {
        return response.unprocessableEntity({ massage: 'Order Not Found' })
      }
    } else {
      return response.unprocessableEntity({ error: 'Unknow URL' })
    }
  }

  async deleteOrder({ params, response }: HttpContext) {
    const id = params.id

    if (id) {
      const getUser = await Orderitem.find(id)
      if (getUser) {
        await getUser.delete()
        return response.status(200).json({ massage: 'Order Delete SuccessFully', data: getUser })
      } else {
        return response.unprocessableEntity({ massage: 'Plz Enter valid Id In URL' })
      }
    } else {
      return response.unprocessableEntity({ error: 'Unknow URL' })
    }
  }
}
