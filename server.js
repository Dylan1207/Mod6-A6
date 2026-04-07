const cors = require('cors');
const express = require('express');
const app = express();
const pool = require('./db');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// GET (FILTER DATA)
app.get('/api/v1/items', async (req, res) => {
  const { name } = req.query;

  try {
    let result;

    if (name) {
      result = await pool.query(
        'SELECT * FROM items WHERE name ILIKE $1',
        [`%${name}%`]
      );
    } else {
      result = await pool.query('SELECT * FROM items');
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST (ADD DATA)
app.post('/api/v1/items', async (req, res) => {
  const { name, price } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO items (name, price) VALUES ($1, $2) RETURNING *',
      [name, price]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PUT (UPDATE DATA)
app.put('/api/v1/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const result = await pool.query(
      'UPDATE items SET name=$1, price=$2 WHERE id=$3 RETURNING *',
      [name, price, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});