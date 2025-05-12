// backend/index.js
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import pg from "pg"

const app = express()
app.use(cors())
app.use(bodyParser.json())

const pool = new pg.Pool({
  user: "postgres",
  host: "switchyard.proxy.rlwy.net",
  database: "railway",
  password: "ERRmqNbJxGwFMDbaxjmTgXkmgbopaytn",
  port: 36880,
  ssl: {
    rejectUnauthorized: false
  }
})

app.post("/api/disposal", async (req, res) => {
  const { email, weight, trashbin_id } = req.body

  if (!weight) return res.status(400).json({ error: "No weight provided" })

  try {
    const user = await pool.query("SELECT user_id FROM users WHERE email = $1", [email])
    if (user.rowCount === 0) return res.status(404).json({ error: "User not found" })

    const userId = user.rows[0].user_id
    const points = Math.floor(weight * 10)

    await pool.query(
      `INSERT INTO bottle_disposals (user_id, trashbin_id, weight, points_earned)
       VALUES ($1, $2, $3, $4)`,
      [userId, trashbin_id, weight, points]
    )

    await pool.query(
      `UPDATE users SET points = points + $1 WHERE user_id = $2`,
      [points, userId]
    )

    res.json({ message: "Disposal saved", weight, points })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

app.get("/api/check-user", async (req, res) => {
  const { email } = req.query
  try {
    const user = await pool.query("SELECT user_id FROM users WHERE email = $1", [email])
    if (user.rowCount === 0) return res.status(404).json({ exists: false })
    return res.json({ exists: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`)
})
