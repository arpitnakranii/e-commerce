import Order from '#models/order'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import { url } from 'inspector'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
interface Item {
  id: number
  quantity: number
}

interface StoreItem {
  price: number
  name: string
}
export default class StripesController {
  async createCheckout({ response, auth }: HttpContext) {
    try {
      const id = auth.user?.id
      const items: Map<number, Item> = new Map()
      console.log(id)
      const billData = await Order.query()
        .where('user_id', id!)
        .preload('userData')
        .preload('orderDetails', (orderDetailsQuery) => {
          orderDetailsQuery.preload('products', (categoryQuery) => {
            categoryQuery.preload('catagorieData')
          })
        })

      for (let element of billData) {
        items.set(element.orderDetails.products.id, {
          id: element.orderDetails.products.id,
          quantity: element.orderDetails.quantity,
        })
      }

      const product = await Product.query()

      const storeItem: Map<number, StoreItem> = new Map()

      for (const element of product) {
        storeItem.set(element.id, { price: Math.floor(element.price), name: element.name })
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'amazon_pay', 'us_bank_account'],
        mode: 'payment',
        line_items: Array.from(items.values()).map((item: Item) => {
          const oreItemDetails = storeItem.get(item.id)
          if (!oreItemDetails) {
            throw new Error(`Item with id ${item.id} not found`)
          }
          console.log(oreItemDetails)
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: oreItemDetails.name,
              },
              unit_amount: oreItemDetails.price,
            },
            quantity: item.quantity,
          }
        }),
        success_url: 'https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://yourdomain.com/cancel',
      })

      console.log(session.url)
      for (let element of billData) {
        element.status = 'Completed'
        await element.save()
      }
      response.redirect(session.url!)
      return response.status(201).json({ url: session.url })
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }
}
