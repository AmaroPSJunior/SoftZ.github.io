const 
    express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    mag = require('./msgLog'),
    app = express(),
    multiparty = require('connect-multiparty'),
    router = express.Router()
;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./app/controllers')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {res.sendfile(path.join(__dirname, '/public/login.html'))}); 
app.get('/login', (req, res) => {res.sendfile(path.join(__dirname, '/public/login.html'))}); 
app.get('/cadastro', (req, res) => {res.sendfile(path.join(__dirname, '/public/cadastro.html'))}); 
app.get('/home', (req, res) => {res.sendfile(path.join(__dirname, '/public/home.html'))}); 
app.get('/erro', (req, res) => {res.sendfile(path.join(__dirname, '/public/erro.html'))}); 

app.use('/api', router);

router.route('/upload').post(multiparty(), require('./app/upload/index'));


mag(); 

app.listen(3001);
