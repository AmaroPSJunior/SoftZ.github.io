const express = require('express');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers')(app);

app.get('/', (req, res) => {
    res.send(`
        <div style="display: flex;justify-content: center;align-items: center;flex-direction: column;height: 90Vh;">
            <h2>Serviço executando com sucesso</h2>
            <h3>Abra o arquivo atalho "index" na raiz do projeto</h3>
        </div>
    `)
}); 


app.listen(3001);