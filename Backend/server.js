require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => console.log("Conectado a Supabase"))
  .catch((err) => console.error("Error de conexión:", err));

app.get("/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
});

app.get("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM productos WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener el producto");
  }
});

app.post("/actualizar-stock", async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Se requiere un arreglo de items" });
  }

  try {
    for (const { id, cantidad } of items) {
      if (!id || !cantidad || cantidad < 1) continue;

      await pool.query(
        "UPDATE productos SET stock = stock - $1 WHERE id = $2 AND stock >= $1",
        [cantidad, id]
      );
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el stock" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});