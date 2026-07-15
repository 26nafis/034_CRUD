const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Koneksi ke PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '123', // Ganti dengan password PostgreSQL Anda
    port: 5432,
});

app.use(express.json());

// Method GET untuk mengambil semua data dari tabel biodata
app.get('/biodata', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM biodata ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Gagal mengambil data'
        });
    }
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});


//post
app.post('/biodata', async (req, res) => {
    const { id, nama, nim, kelas } = req.body; // Sesuaikan dengan kolom tabel Anda
    try {
        const query = 'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [id, nama, nim, kelas];
        const result = await pool.query(query, values);
        
        res.status(201).json({
            message: 'Data berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Gagal menambahkan data'
        });
    }
});
//put

//delete