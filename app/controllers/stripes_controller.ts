import Order from '#models/order'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
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

      const billData = await Order.query()
        .where('user_id', id!)
        .andWhere('status', 'Pending')
        .preload('userData')
        .preload('orderDetails', (orderDetailsQuery) => {
          orderDetailsQuery.preload('products', (categoryQuery) => {
            categoryQuery.preload('catagoriesData')
          })
        })
      if (billData.length === 0) {
        return response.unprocessableEntity('Order item is empty')
      }

      for (let element of billData) {
        items.set(element.orderDetails.products.id, {
          id: element.orderDetails.products.id,
          quantity: element.orderDetails.quantity,
        })
      }

      const product = await Product.query()

      const storeItem: Map<number, StoreItem> = new Map()

      for (const element of product) {
        storeItem.set(element.id, { price: Math.floor(element.price) * 100, name: element.name })
      }

      const paymentSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'amazon_pay', 'us_bank_account'],
        mode: 'payment',
        line_items: Array.from(items.values()).map((item: Item) => {
          const oreItemDetails = storeItem.get(item.id)
          if (!oreItemDetails) {
            throw new Error(`Item with id ${item.id} not found`)
          }

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
        success_url: 'https://www.youtube.com/',
        cancel_url: 'https://www.youtube.com/',
      })
      return { url: paymentSession.url }
    } catch (err) {
      return response.unprocessableEntity({ error: err })
    }
  }

  async getPaymentData({ response, session }: HttpContext) {
    try {
      const paymentData = await stripe.checkout.sessions.retrieve(session.get('sessionId'))
      return { paymentData }
    } catch (err) {
      response.unprocessableEntity({ error: err })
    }
  }
  async handleWebhook({ request, response }: HttpContext) {
    request.header('Content-Type', 'application/json')
    const sig = request.header('stripe-signature') // Extract the stripe-signature header
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
    if (!sig) {
      console.error('Stripe signature header is missing')
      return response
        .status(400)
        .type('application/json')
        .send({ error: 'Missing stripe-signature header' })
    }
    let event: Stripe.Event
    const rawBody = request.raw()

    try {
      event = stripe.webhooks.constructEvent(rawBody!, sig, endpointSecret)

      switch (event.type) {
        case 'charge.succeeded':
          break
        case 'charge.failed':
          console.log('payment Failed ')
          break
        case 'charge.refunded':
          console.log('payment Refunded ')
          break
        default:
          console.log(`Unhandled event type ${event.type}`)
      }

      response.status(200).type('application/json').send({ message: 'Event received' })
    } catch (err) {
      console.error('Webhook Error:', err.message)
      return response
        .status(400)
        .type('application/json')
        .send({ error: `Webhook Error: ${err.message}` })
    }
  }
}
