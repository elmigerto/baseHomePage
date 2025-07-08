import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import sqlite3 from 'sqlite3'

dotenv.config()

// Initialize SQLite database to store orders
const db = new sqlite3.Database('orders.db')
db.run(
  'CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, items TEXT, address TEXT)'
)

const app = express()
app.use(express.json())

const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2024-08-16' })

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, address } = req.body
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items,
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: address,
    })
    // Persist order details for later processing
    db.run(
      'INSERT INTO orders (id, items, address) VALUES (?, ?, ?)',
      [session.id, JSON.stringify(items), JSON.stringify(address)],
      (err) => {
        if (err) console.error('DB insert error:', err)
      }
    )
    res.json({ url: session.url })
  } catch (err) {
    res.status(500).json({ error: 'Unable to create session' })
  }
})

// Simple endpoint to view stored orders
app.get('/orders', (req, res) => {
  db.all('SELECT * FROM orders', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Unable to fetch orders' })
    res.json(rows)
  })
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server running on ${port}`))
