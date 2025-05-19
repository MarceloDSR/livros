const express = require('express');
const cors = require('cors');
const livrosRoutes = require('./api/index.js');  

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());


app.use(express.json());


app.use('/api/livros', livrosRoutes);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
