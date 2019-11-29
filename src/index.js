const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
//const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendfile(path.join(__dirname, '/public/login.html'));
}); 

app.get('/login', (req, res) => {
    res.sendfile(path.join(__dirname, '/public/login.html'));
}); 

app.get('/cadastro', (req, res) => {
    res.sendfile(path.join(__dirname, '/public/cadastro.html'));
}); 

app.get('/home', (req, res) => {
    //res.sendfile(`${__dirname}/public/home.html`);
    res.sendfile(path.join(__dirname, '/public/home.html'));
}); 

app.get('/erro', (req, res) => {
    res.sendfile(path.join(__dirname, '/public/erro.html'));
}); 


app.listen(3001);