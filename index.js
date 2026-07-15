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
    const { nama, nim, kelas } = req.body;

    try {
        const query = `INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3)RETURNING *;`;
        const result = await pool.query(query, [nama, nim,kelas
        ]);

        res.status(201).json({
            message: 'Data berhasil ditambahkan',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});
//put
app.put('/biodata/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    try {
        const query = `UPDATE biodata SET nama = $1, nim = $2, kelas = $3  WHERE id = $4 RETURNING *;`;
        const result = await pool.query(query, [nama, nim, kelas, id ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Data berhasil diperbarui',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});
//delete
app.delete('/biodata/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            DELETE FROM biodata
            WHERE id = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Data berhasil dihapus',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});
