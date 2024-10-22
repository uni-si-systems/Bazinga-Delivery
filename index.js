const express = require('express');
const app = express();
app.use(express.json());

let restaurantes = []; // Simulação de banco de dados

app.post('/restaurantes', (req, res) => {
    const { nome, endereco, tipo_cozinha } = req.body;
    const novoRestaurante = { id: restaurantes.length + 1, nome, endereco, tipo_cozinha };
    restaurantes.push(novoRestaurante);
    res.status(201).json(novoRestaurante);
});

app.get('/restaurantes', (req, res) => {
    res.json(restaurantes);
});

app.get('/restaurantes/:id', (req, res) => {
    const restaurante = restaurantes.find(r => r.id === parseInt(req.params.id));
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    res.json(restaurante);
});

app.put('/restaurantes/:id', (req, res) => {
    const restaurante = restaurantes.find(r => r.id === parseInt(req.params.id));
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    const { nome, endereco, tipo_cozinha } = req.body;
    restaurante.nome = nome;
    restaurante.endereco = endereco;
    restaurante.tipo_cozinha = tipo_cozinha;
    res.json(restaurante);
});

app.delete('/restaurantes/:id', (req, res) => {
    const index = restaurantes.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Restaurante não encontrado');
    const deletado = restaurantes.splice(index, 1);
    res.json(deletado);
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
