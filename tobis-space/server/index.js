import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())

const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2024-08-16' })

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, address } = req.body
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: address,
    })
    res.json({ url: session.url })
  } catch (err) {
    res.status(500).json({ error: 'Unable to create session' })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server running on ${port}`))
