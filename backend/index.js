// backend/index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcryptjs";
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
  const { email, bottle_count, trashbin_id } = req.body;

  // Validasi input
  if (!email || !trashbin_id || bottle_count === undefined || isNaN(bottle_count)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const count = parseInt(bottle_count);
  const trashbinId = parseInt(trashbin_id);
  const points = count * 10;

  try {
    // Cek apakah user ada
    const user = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (user.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user.rows[0].user_id;

    // Simpan disposal
    await pool.query(
      `INSERT INTO bottle_disposals (user_id, trashbin_id, bottle_count, points_earned)
       VALUES ($1, $2, $3, $4)`,
      [userId, trashbinId, count, points]
    );

    // Update poin user
    await pool.query(
      `UPDATE users SET points = points + $1 WHERE user_id = $2`,
      [points, userId]
    );

    res.json({ message: "Disposal saved", bottle_count: count, points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/checkuser", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email tidak diberikan" });

  try {
    const result = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ exists: false, message: "User tidak ditemukan" });
    }

    return res.status(200).json({ exists: true, user_id: result.rows[0].user_id });
  } catch (err) {
    console.error("Error saat mengecek user:", err);
    return res.status(500).json({ error: "Internal server error" });
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

// API DISPOSAL TREND ACCORDING TO TIME
app.get("/api/disposal/trend", async (req, res) => {
  const { period } = req.query;

  // validasi periode
  const allowedPeriods = ["day", "month", "year"];
  const groupBy = allowedPeriods.includes(period) ? period : "day";

  try {
    const result = await pool.query(
      `
      SELECT 
        DATE_TRUNC($1, created_at) AS period,
        SUM(bottle_count) AS total_bottles
      FROM bottle_disposals
      GROUP BY period
      ORDER BY period DESC
    `,
      [groupBy]
    );

    res.json(result.rows);
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

// get sum of bottle disposals
app.get("/api/disposal/total-bottles", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT SUM(bottle_count) AS total_bottle_count FROM bottle_disposals"
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
    const result = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);
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
    const hashedPassword = await bcrypt.hash(password, 10); // hash password dengan saltRounds = 10

    const result = await pool.query(
      "INSERT INTO admin (email, password) VALUES ($1, $2) RETURNING admin_id, email, created_at",
      [email, hashedPassword]
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


// LOGIN user
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi" });
  }

  try {
    // Cek apakah user ada
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Email tidak ditemukan" });
    }

    const user = result.rows[0];

    // Bandingkan password (asumsi password di DB sudah dalam bentuk hash)
    const isMatch = password === user.password;
    
    if (!isMatch) {
      return res.status(401).json({ error: "Password salah" });
    }

    // Buat response tanpa password
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: "Login berhasil",
      user: userData,
    });
  } catch (err) {
    console.error("Login user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//register user
app.post("/api/users/register", async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi" });
  }

  try {
    // Cek apakah email sudah digunakan
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rowCount > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    // Simpan user baru (tanpa bcrypt, password langsung)
    const result = await pool.query(
      `INSERT INTO users (email, password, points, created_at)
       VALUES ($1, $2, 0, NOW())
       RETURNING user_id, email, points, created_at`,
      [email, password]
    );

    const newUser = result.rows[0];
    res.status(201).json({ message: "Registrasi berhasil", user: newUser });
  } catch (err) {
    console.error("Error saat register user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// disposal history
app.get("/api/users/:userId/disposals", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT disposal_id, trashbin_id, points_earned, bottle_count, created_at 
       FROM bottle_disposals 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching disposal history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/rewards/redeem", async (req, res) => {
  const { user_id, reward_id } = req.body;

  if (!user_id || !reward_id) {
    return res.status(400).json({ error: "user_id dan reward_id wajib diisi" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Ambil data reward dan user, kunci dengan FOR UPDATE
    const rewardResult = await client.query(
      "SELECT * FROM rewards WHERE reward_id = $1 FOR UPDATE",
      [reward_id]
    );

    const userResult = await client.query(
      "SELECT * FROM users WHERE user_id = $1 FOR UPDATE",
      [user_id]
    );

    if (rewardResult.rowCount === 0 || userResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User atau reward tidak ditemukan" });
    }

    const reward = rewardResult.rows[0];
    const user = userResult.rows[0];

    // Validasi stok dan poin
    if (reward.stock <= 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Stok reward habis" });
    }

    if (user.points < reward.point_cost) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Poin tidak cukup" });
    }

    // Insert ke tabel redemptions
    await client.query(
      `INSERT INTO redemptions (user_id, reward_id, created_at)
       VALUES ($1, $2, NOW())`,
      [user_id, reward_id]
    );

    // Update poin user
    await client.query(
      "UPDATE users SET points = points - $1 WHERE user_id = $2",
      [reward.point_cost, user_id]
    );

    // Update stok reward
    await client.query(
      "UPDATE rewards SET stock = stock - 1 WHERE reward_id = $1",
      [reward_id]
    );

    // Ambil poin terbaru
    const updatedUser = await client.query(
      "SELECT points FROM users WHERE user_id = $1",
      [user_id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Reward berhasil ditukar",
      new_points: updatedUser.rows[0].points,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error redeeming reward:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  } finally {
    client.release();
  }
});

app.get("/api/users/:id/points", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT points FROM users WHERE user_id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.status(200).json({ points: result.rows[0].points });
  } catch (err) {
    console.error("Error mengambil poin user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/users/:id/reset-password", async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "Password baru wajib diisi" });
  }

  try {
    // Cek apakah user ada
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }
    
    // Update password di database
    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [newPassword, id]);

    res.status(200).json({ message: "Password berhasil diperbarui" });
  } catch (err) {
    console.error("Error saat reset password:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

app.get("/api/rewards/redemptions/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        r.name AS reward_name,
        r.point_cost,
        rd.created_at
      FROM redemptions rd
      JOIN rewards r ON rd.reward_id = r.reward_id
      WHERE rd.user_id = $1
      ORDER BY rd.created_at DESC
      `,
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching redemption history:", err);
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
