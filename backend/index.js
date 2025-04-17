const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// File upload setup
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const upload = multer({ storage });

// API to store form data
app.post("/register", upload.single("document"), (req, res) => {
  const {
    customerName,
    aadhaar,
    email,
    phone,
    address1,
    address2,
    country,
    state,
    gender,
    password,
  } = req.body;

  const documentPath = req.file ? req.file.filename : null;

  const sql = `INSERT INTO customers
    (customer_name, aadhaar, email, phone, address1, address2, country, state, gender, password, document_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      customerName,
      aadhaar,
      email,
      phone,
      address1,
      address2,
      country,
      state,
      gender,
      password,
      documentPath,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Customer registered successfully!" });
    }
  );
});

app.get('/customers', (req, res) => {
    db.query('SELECT * FROM customer_db.customers;', (err, results) => {
      if (err) {
        console.error('Error fetching customers:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(results);
    });
  });
  

app.get("/customers/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM customer_db.customers; WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(results[0]);
  });
});

app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM customer_db.customers WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ message: "Customer deleted" });
  });
});

app.put("/customers/:id", (req, res) => {
  const { id } = req.params;
  const {
    customerName,
    aadhaar,
    email,
    phone,
    address1,
    address2,
    country,
    state,
    gender,
    password,
  } = req.body;

  const sql = `UPDATE customers SET customer_name=?, aadhaar=?, email=?, phone=?, address1=?, address2=?, country=?, state=?, gender=?, password=? WHERE id=?`;

  db.query(
    sql,
    [
      customerName,
      aadhaar,
      email,
      phone,
      address1,
      address2,
      country,
      state,
      gender,
      password,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Customer updated successfully" });
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
