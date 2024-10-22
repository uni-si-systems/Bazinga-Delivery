const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// Configuração da view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração do bodyParser para interpretar dados dos formulários
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do middleware de sessão
app.use(session({
    secret: 'segredo-super-seguro', // Trocar por um segredo mais seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Coloque como true se estiver usando HTTPS
}));

// Configuração da pasta pública para arquivos estáticos
app.use('/publico', express.static(path.join(__dirname, 'publico')));

// Conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bazinga_delivery'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

// Função para verificar se o usuário está autenticado(caso pe)
function verificaAutenticacao(req, res, next) {
    if (req.session.user) {
        next(); // Prossegue se o usuário estiver autenticado
    } else {
        res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
}

// Rota para a tela principal (Login e Cadastro)
app.get('/', (req, res) => {
    res.render('index'); // Renderiza o arquivo index.ejs
});

// Rota da página home após login
app.get('/home', verificaAutenticacao, (req, res) => {
    res.render('home', { user: req.session.user }); // Passa o usuário logado para a página
});

// cadastro de usuários
app.post('/cadastro-usuario', (req, res) => {
    const { nome, email, senha } = req.body;
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.query(query, [nome, email, senha], (err) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).send('Erro ao cadastrar usuário');
        }
        res.redirect('/'); // Redireciona para a página de login após cadastro
    });
});

// Rota de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    db.query(query, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro ao fazer login:', err);
            return res.status(500).send('Erro ao fazer login');
        }
        if (results.length > 0) {
            req.session.user = results[0]; // Salva o usuário na sessão
            res.redirect('/home'); // Redireciona para a página home após login
        } else {
            res.status(401).send('Email ou senha incorretos');
        }
    });
});

// Rota para cadastrar item
app.post('/cadastro-item', (req, res) => {
    const { nome, descricao, preco } = req.body;

    const query = 'INSERT INTO itenscardapio (nome, descricao, preco) VALUES (?, ?, ?)';
    db.query(query, [nome, descricao, preco], (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar item:', error);
            return res.status(500).send('Erro ao cadastrar item');
        }

        res.redirect('/menu'); // Redireciona para a página do menu após o cadastro
    });
});

// Rota para remover item do cardápio
app.post('/remover-item', (req, res) => {
    const { id } = req.body; // Obtém o ID do item a ser removido
    const query = 'DELETE FROM itenscardapio WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Erro ao remover item:', err);
            return res.status(500).send('Erro ao remover item');
        }
        res.redirect('/menu'); 
    });
});

// Rota para listar Restaurantes 
app.get('/restaurantes', verificaAutenticacao, (req, res) => {
    db.query('SELECT * FROM restaurantes', (err, results) => {
        if (err) {
            console.error('Erro ao buscar restaurantes:', err);
            return res.status(500).send('Erro ao buscar restaurantes');
        }
        // Passa a variável mensagem como null ou string vazia
        res.render('restaurantes', { restaurantes: results, mensagem: null });
    });
});

// Rota para cadastrar restaurante
app.post('/cadastro-restaurante', verificaAutenticacao, (req, res) => {
    const { nome, descricao, tipo_cozinha } = req.body; // Capturando o tipo_cozinha

    const query = 'INSERT INTO restaurantes (nome, descricao, tipo_cozinha) VALUES (?, ?, ?)';
    db.query(query, [nome, descricao, tipo_cozinha], (err) => {
        if (err) {
            console.error('Erro ao cadastrar restaurante:', err);
            return res.status(500).send('Erro ao cadastrar restaurante');
        }
        res.redirect('/restaurantes');
    });
});

// Rota para remover restaurante
app.post('/remover-restaurante', verificaAutenticacao, (req, res) => {
    const { id } = req.body; 
    const query = 'DELETE FROM restaurantes WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Erro ao remover restaurante:', err);
            return res.status(500).send('Erro ao remover restaurante');
        }
        res.redirect('/restaurantes');
    });
});

// Rota para listar Itens do Cardápio (protegida, requer autenticação)
app.get('/menu', verificaAutenticacao, (req, res) => {
    db.query('SELECT * FROM itenscardapio', (err, results) => {
        if (err) {
            console.error('Erro ao buscar itens do cardápio:', err);
            return res.status(500).send('Erro ao buscar itens do cardápio');
        }
        res.render('menu', { menuItems: results });
    });
});

// Rota para listar Pedidos e carregar os itens do cardápio
app.get('/pedidos', verificaAutenticacao, (req, res) => {
    const queryPedidos = 'SELECT * FROM pedidos WHERE usuario_id = ?'; // Filtra os pedidos do usuário

    db.query(queryPedidos, [req.session.user.id], (err, pedidos) => {
        if (err) {
            console.error('Erro ao buscar pedidos:', err);
            return res.status(500).send('Erro ao buscar pedidos');
        }

        // Carrega os restaurantes e itens do cardápio em paralelo
        const queryRestaurantes = 'SELECT * FROM restaurantes';
        const queryItens = 'SELECT * FROM itenscardapio';
        
        db.query(queryRestaurantes, (err, restaurantes) => {
            if (err) {
                console.error('Erro ao buscar restaurantes:', err);
                return res.status(500).send('Erro ao buscar restaurantes');
            }

            db.query(queryItens, (err, cardapio) => {
                if (err) {
                    console.error('Erro ao buscar itens do cardápio:', err);
                    return res.status(500).send('Erro ao buscar itens do cardápio');
                }

                // Renderiza a página de pedidos com os dados necessários
                res.render('pedidos', { pedidos, restaurantes, cardapio });
            });
        });
    });
});

// Rota para fazer um novo pedido
app.post('/fazer-pedido', verificaAutenticacao, (req, res) => {
    const { item_id, restaurante_id } = req.body; // Obtém o ID do item e do restaurante
    const query = 'INSERT INTO pedidos (usuario_id, item_id, restaurante_id, status) VALUES (?, ?, ?, ?)';
    const status = 'pendente'; // Definindo o status inicial como 'pendente'

    db.query(query, [req.session.user.id, item_id, restaurante_id, status], (err) => {
        if (err) {
            console.error('Erro ao fazer pedido:', err);
            return res.status(500).send('Erro ao fazer pedido');
        }
        res.redirect('/pedidos-feitos'); 
    });
});

app.post('/remover-pedido/:id', (req, res) => {
    const pedidoId = req.params.id;

    console.log(`Tentando remover o pedido com ID: ${pedidoId}`); // serve para verificar o ID(lembrar de falar)

    const sql = 'DELETE FROM pedidos WHERE id = ?';
    db.query(sql, [pedidoId], (error, results) => {
        if (error) {
            console.error('Erro ao remover o pedido:', error);
            return res.status(500).send('Erro ao remover o pedido: ' + error.message);
        }

        console.log(`Pedidos removidos: ${results.affectedRows}`); // Serve para verificar quantos pedidos foram removidos(Pedro ou toin falar)
        res.redirect('/pedidos-feitos'); 
    });
});




// Rota para listar pedidos feitos
app.get('/pedidos-feitos', verificaAutenticacao, (req, res) => {
    const usuarioId = req.session.user.id;

    const sql = `
        SELECT p.id, p.item_id, p.restaurante_id, p.status, i.nome AS item_nome, r.nome AS restaurante_nome
        FROM pedidos p
        JOIN itenscardapio i ON p.item_id = i.id
        JOIN restaurantes r ON p.restaurante_id = r.id
        WHERE p.usuario_id = ?
    `;

    db.query(sql, [usuarioId], (err, pedidosFeitos) => {
        if (err) {
            console.error('Erro ao buscar pedidos feitos:', err);
            return res.status(500).send('Erro ao buscar pedidos feitos');
        }
        res.render('pedidos-feitos', { pedidosFeitos }); // Renderiza a página de pedidos feitos
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


