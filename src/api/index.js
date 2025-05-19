const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();


const livrosPath = path.join(__dirname, 'livros.json');


const getLivros = () => {
    try {
        if (!fs.existsSync(livrosPath)) {
            fs.writeFileSync(livrosPath, '[]');
            return [];
        }

        const data = fs.readFileSync(livrosPath, 'utf-8');
        if (!data.trim()) return [];

        return JSON.parse(data);
    } catch (error) {
        console.log("Erro ao ler livros.json", error);
        return [];
    }
};


router.get('/api/livros', (req, res) => {
    try {
        const livros = getLivros();
        res.json(livros);
    } catch (error) {
        res.status(500).json({ error: "Erro ao obter livros" });
    }
});


router.get('/api/livros/:id', (req, res) => {
    try {
        const { id } = req.params;
        const livros = getLivros();
        const livro = livros.find(l => l.id == id);

        if (!livro) {
            return res.status(404).json({ error: "Livro não encontrado" });
        }

        res.json(livro);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar livro" });
    }
});


router.post('/api/livros', (req, res) => {
    try {
        const { titulo, autor, editora, ano, genero } = req.body;

        if (!titulo || !autor || !editora || !ano || !genero) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const livros = getLivros();

        const novoLivro = {
            id: livros.length > 0 ? Math.max(...livros.map(l => l.id)) + 1 : 1,
            titulo,
            autor,
            editora,
            ano,
            genero
        };

        livros.push(novoLivro);
        fs.writeFileSync(livrosPath, JSON.stringify(livros, null, 2));

        res.status(201).json(novoLivro);
    } catch (error) {
        res.status(500).json({ error: "Erro ao adicionar novo livro" });
    }
});


router.delete('/api/livros/:id', (req, res) => {
    try {
        const { id } = req.params;
        let livros = getLivros();

        const livroIndex = livros.findIndex(l => l.id == id);

        if (livroIndex === -1) {
            return res.status(404).json({ error: "Livro não encontrado" });
        }

        livros.splice(livroIndex, 1);
        fs.writeFileSync(livrosPath, JSON.stringify(livros, null, 2));

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar livro" });
    }
});

module.exports = router;
