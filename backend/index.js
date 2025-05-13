// backend/index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new pg.Pool({
  user: "postgres",
  host: "switchyard.proxy.rlwy.net",
  database: "railway",
  password: "ERRmqNbJxGwFMDbaxjmTgXkmgbopaytn",
  port: 36880,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.post("/api/disposal", async (req, res) => {
  const { email, weight, trashbin_id } = req.body;

  if (!weight) return res.status(400).json({ error: "No weight provided" });

  try {
    const user = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );
    if (user.rowCount === 0)
      return res.status(404).json({ error: "User not found" });

    const userId = user.rows[0].user_id;
    const points = Math.floor(weight * 10);

    await pool.query(
      `INSERT INTO bottle_disposals (user_id, trashbin_id, weight, points_earned)
       VALUES ($1, $2, $3, $4)`,
      [userId, trashbin_id, weight, points]
    );

    await pool.query(
      `UPDATE users SET points = points + $1 WHERE user_id = $2`,
      [points, userId]
    );

    res.json({ message: "Disposal saved", weight, points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});





// API FOR CHECKING USER
// Check if user exists
app.get("/api/check-user", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );
    if (user.rowCount === 0) return res.status(404).json({ exists: false });
    return res.json({ exists: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

//make api CRUD using http for rewards
// GET all rewards
app.get("/api/rewards", async (req, res) => {
  try {
    const rewards = await pool.query(
      "SELECT * FROM rewards ORDER BY created_at DESC"
    );
    res.json(rewards.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE new reward
app.post("/api/rewards", async (req, res) => {
  const { name, description, point_cost, stock } = req.body;
  try {
    const newReward = await pool.query(
      "INSERT INTO rewards (name, description, point_cost, stock) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, point_cost, stock]
    );
    res.status(201).json(newReward.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE reward by ID
app.put("/api/rewards/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, point_cost, stock } = req.body;
  try {
    const updatedReward = await pool.query(
      `UPDATE rewards 
       SET name = $1, description = $2, point_cost = $3, stock = $4 
       WHERE reward_id = $5 
       RETURNING *`,
      [name, description, point_cost, stock, id]
    );
    if (updatedReward.rowCount === 0)
      return res.status(404).json({ error: "Reward not found" });
    res.json(updatedReward.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE reward by ID
app.delete("/api/rewards/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedReward = await pool.query(
      "DELETE FROM rewards WHERE reward_id = $1 RETURNING *",
      [id]
    );
    if (deletedReward.rowCount === 0)
      return res.status(404).json({ error: "Reward not found" });
    res.json(deletedReward.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/rewards/leaderboard", async (req, res) => {
  const { period } = req.query;

  // validasi periode
  const allowedPeriods = ["day", "month", "year"];
  const groupBy = allowedPeriods.includes(period) ? period : "day";

  try {
    const result = await pool.query(
      `
      SELECT 
        DATE_TRUNC($1, rd.created_at) AS period,
        r.reward_id,
        r.name,
        COUNT(rd.reward_id) AS total_redemptions
      FROM rewards r
      LEFT JOIN redemptions rd ON r.reward_id = rd.reward_id
      GROUP BY period, r.reward_id, r.name
      ORDER BY period DESC, total_redemptions DESC
    `,
      [groupBy]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get total users
app.get("/api/users/total", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get total points
app.get("/api/users/total-points", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT SUM(points) AS total_points FROM users"
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get weight of total disposals
app.get("/api/disposals/total-weight", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT SUM(weight) AS total_weight FROM bottle_disposals"
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// CRUD admin
// login admin
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM admin WHERE email = $1",
      [email]
    );
    if (result.rowCount === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/admins", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT admin_id, email, created_at FROM admin"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/admins", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO admin (email, password) VALUES ($1, $2) RETURNING admin_id, email, created_at",
      [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});
app.put("/api/admins/:id/password", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "UPDATE admin SET password = $1 WHERE admin_id = $2 RETURNING admin_id, email, created_at",
      [hashedPassword, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Admin not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.delete("/api/admins/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM admin WHERE admin_id = $1 RETURNING admin_id, email",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Admin not found" });
    res.json({ message: "Admin deleted", admin: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});
