const express = require("express");

const client = require('./db/pg_config');
client.connect();

const server = express();
server.use(express.json());

const shortid = require('shortid');
const openurl = require("openurl");

//- um método que retorna uma url encurtada conforme o encurtamento da URL.
server.get('/short/:chave', async (req, res) =>{
    const {chave} = req.params;
    const encurtador = await getByChave(chave);
    
    if(!encurtador){
        return res.status(400).json({error : "Url não encontrada"});
    }

    openurl.open(encurtador.url);
    return res.status(200).json("Sucesso");
});

//- um método que retorna uma url encurtada conforme um id.
server.get('/find/:chave', async (req, res) =>{
    const {chave} = req.params;
    const encurtador = await getByChave(chave);
    return retornaJson(res, encurtador);
});

//- um método que retorna todas as URLs encurtadas em uma data específica.
server.get('/list/:dt_cadastro', async (req, res) =>{
    const {dt_cadastro} = req.params;
    const lista = await getByDataCadastro(dt_cadastro);
    return retornaJson(res, lista);
});

//- um método de encurtar uma URL persistindo-a no banco de dados.
server.post('/short', async (req, res) =>{
    const chave = shortid.generate();
    const {url} = req.body;
    const url_curta = getBaseUrl(req) + chave;

    const dados = [chave, url, url_curta];

    const encurtador = await inserir(dados);

    return retornaJson(res, encurtador.url_curta);
});

function getBaseUrl(req){
    const protocol = req.protocol;
    const host = req.hostname;
    const port = req.socket.localPort ? ":" + req.socket.localPort : "";
    const urlBase = `${protocol}://${host}${port}/short/`;
    return urlBase;
}

function retornaJson(res, retorno){
    if(!retorno){
        return res.status(400).json({error : "Não encontrado"});
    }
    return res.json(retorno);
}

async function getByChave(chave){
    try {
        const sql = 'SELECT * FROM unileya.encurtador where chave = $1';
        const result = await client.query(sql, [chave]);
        return result.rows[0];
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}

async function getByDataCadastro(dt_cadastro){
    try {
        const sql = 'SELECT url_curta FROM unileya.encurtador where dt_cadastro::date = $1::date order by dt_cadastro';
        const result = await client.query(sql, [dt_cadastro]);
        return result.rows;
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}

async function inserir(values){
    try {
        const sql = 'INSERT INTO unileya.encurtador(chave, url, url_curta) VALUES($1, $2, $3) RETURNING *';
        const result = await client.query(sql, values);
        return result.rows[0];
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}

server.listen(3333);