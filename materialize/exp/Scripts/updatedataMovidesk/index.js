const request = require("request");
const express = require("express");
const axios = require("axios");
const app = express();
let page = 0;

app.get("/getDadosMovidesk", function(req, res) {
    page = req.query.page !== undefined ? req.query.page : "0";
    axios
        .get(
            `https://api.movidesk.com/public/v1/tickets?token=7ba6f07f-3e99-4d0d-b988-222759dde6b1&$select=id,type,subject,createdDate,slaResponseDate,resolvedIn,reopenedIn,closedIn,serviceFull,urgency,justification,status,category,slaAgreementRule&$expand=owner,clients,actions&$skip=${page}`
        )
        .then(response => res.send(response.data))
        .catch(function(error) {
            console.log(error);
        });
});

var server = app.listen(3333, () => {
    console.log("Servidor rodando local na porta 3333");
});

request(`http://localhost:3333/getDadosMovidesk?page=${page}`, function(
    error,
    response,
    body
) {
    if (!error && response.statusCode == 200) {
        const dados = JSON.parse(response.body);
        montaDadosGVCollege(dados);
    }
});

function montaDadosGVCollege(data) {
    var Parametros = [];
    for (var i = 0; i < data.length; i++) {
        var numero = data[i].id;
        var tipo = data[i].type;
        if (tipo == 2) {
            tipo = "Público";
        } else {
            tipo = "Privado";
        }

        if (tipo == null) {
            tipo = "";
        }

        var assunto = data[i].subject;
        if (assunto == null) {
            assunto = "";
        }
        var data_abertura = data[i].createdDate;
        if (data_abertura != null) {
            data_abertura = data_abertura.substr(0, 16);
            data_abertura = data_abertura.replace("T", " ");
        } else {
            data_abertura = "";
        }
        var vencimento = data[i].slaResponseDate;
        if (vencimento != null) {
            vencimento = vencimento.substr(0, 16);
            vencimento = vencimento.replace("T", " ");
        } else {
            vencimento = "";
        }
        var resolvido = data[i].resolvedIn;
        if (resolvido != null) {
            resolvido = resolvido.substr(0, 16);
            resolvido = resolvido.replace("T", " ");
        } else {
            resolvido = "";
        }
        var fechado = data[i].closedIn;
        if (fechado != null) {
            fechado = fechado.substr(0, 16);
            fechado = fechado.replace("T", " ");
        } else {
            fechado = "";
        }

        var reaberto = data[i].reopenedIn;
        if (reaberto != null) {
            reaberto = reaberto.substr(0, 16);
            reaberto = reaberto.replace("T", " ");
        } else {
            reaberto = "";
        }

        var cliente = data[i]["clients"][0].businessName;
        if (cliente == null) {
            cliente = "";
        }
        var servico =
            "" + data[i].serviceFull[0] + " » " + data[i].serviceFull[1] + "";
        if (servico == null) {
            servico = "";
        }

        if (data[i]["owner"] != null) {
            var responsavel = data[i]["owner"].businessName;
            if (responsavel == null) {
                responsavel = "";
            }
        }

        var Categoria = data[i].category;
        if (Categoria == null) {
            Categoria = "";
        }
        var urgencia = data[i].urgency;
        if (urgencia == null) {
            urgencia = "";
        }
        var status = data[i].status;
        if (status == null) {
            status = "";
        }
        var Justificativa = data[i].justification;
        if (Justificativa == null) {
            Justificativa = "";
        }
        if (new Date(data[i].slaResponseDate) < new Date(data[i].resolvedIn)) {
            var sla = "Fora do prazo";
        } else {
            var sla = "No prazo";
        }
        var Descricao = data[i].actions[0].description;
        if (Descricao == null) {
            Descricao = "";
        }

        Parametros.push({
            NumeroChamado: numero,
            TipoChamado: tipo,
            Assunto: assunto,
            DataAbertura: data_abertura,
            DataVencimento: vencimento,
            DataResolucao: resolvido,
            DataFechamento: fechado,
            DataReabertura: reaberto,
            Cliente: cliente,
            Servico: servico,
            Responsavel: responsavel,
            Categoria: Categoria,
            Urgencia: urgencia,
            Status: status,
            Justificativa: Justificativa,
            SLA: sla,
            Descricao: Descricao
        });
    }

    var obj = { Campos: Parametros };
    var length = data.length;

    axios
        .post(
            "https://slconstruct.saolucas.edu.br/ProjecaoMovidesk/ProjecaoMovidesk",
            obj
        )
        .then(response => {
            console.log(response.data);
            let pageOld = Number(page) + 1;
            page = Number(page) + 1000;
            console.log(
                `Registro salvos da página ${pageOld} à página ${page}`
            );
            if (length == 1000) {
                request(
                    `http://localhost:3333/getDadosMovidesk?page=${page}`,
                    function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            const dados = JSON.parse(response.body);
                            montaDadosGVCollege(dados);
                        }
                    }
                );
            } else {
                console.log("Finalizado");
                server.close();
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}
