const express = require("express");

const client = require('./db/pg_config');
client.connect();

const server = express();
server.use(express.json());


server.get('/produtos/:produtoId', async (req, res) =>{
    const {produtoId} = req.params;
    const produto = await getById(produtoId);
    return retornaJson(res, produto);
});

server.get('/produtos', async (req, res) =>{
    const lista = await getAll();
    return retornaJson(res, lista);
});

server.post('/produtos', async (req, res) =>{
    const {nome, preco} = req.body;
    const dados = [nome, preco];
    const produto = await inserir(dados);
    return retornaJson(res, produto);
});

server.put('/produtos/:produtoId', async (req, res) =>{
    const {produtoId} = req.params;
    const {nome, preco} = req.body;
    const dados = [produtoId, nome, preco];
    const produto = await atualizar(dados);
    return retornaJson(res, produto);
});

function retornaJson(res, retorno){
    if(!retorno){
        return res.status(400).json({error : "Não encontrado"});
    }
    return res.json(retorno);
}

async function getAll(){
    try {
        const result = await client.query('SELECT * FROM unileya.produtos');
        return result.rows;
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}

async function getById(id){
    try {
        const result = await client.query('SELECT * FROM unileya.produtos where id = ' + id);
        return result.rows[0];
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}

async function inserir(values){
    try {
        const sql = 'INSERT INTO unileya.produtos(nome, preco) VALUES($1, $2) RETURNING *';
        const result = await client.query(sql, values);
        return result.rows[0];
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}

async function atualizar(values){
    try {
        const sql = 'UPDATE unileya.produtos SET nome = $2, preco = $3 WHERE id = $1 RETURNING *';
        const result = await client.query(sql, values);
        return result.rows[0];
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}



server.listen(3333);