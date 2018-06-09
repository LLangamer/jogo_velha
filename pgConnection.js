const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const router = express.Router();

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:ifg@localhost:5432/curso_node';
const client = new pg.Client(connectionString);
client.connect();

//definindo as rotas
router.post('/api/v1/inserir', (req, res, next) => {

	console.log(req.body);
	
  const results = [];
  // Grab data from http request
  
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO jogador(nome) values($1)',
    [req.body.nome]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM jogador ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.get('/api/v1/todos/:todo_nome', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const nome = req.params.todo_nome;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM jogador WHERE nome=($1)', [nome]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM jogador ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.get('/api/v1/todos/:todo_id/:todo_nome', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
   const nome = req.params.todo_nome;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE jogador SET nome=($1) WHERE id=($2)',
    [nome , id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM jogador ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});
router.get('/api/v1/pesquisa', (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin','*');
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.id;
  console.log(id);
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    const query =client.query('SELECT * FROM jogador '
    );
    // SQL Query > Select Data
    
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');