

const express = require('express');
const fs = require('fs');
  
module.exports = function(req, res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    let 
        arquivo = req.files.file,
        temporario = req.files.file.path,
        novo = __dirname + '/files/' + `${req.query.data}-` + req.files.file.name
    ;

 	fs.rename(temporario, novo, function(err){
 		if(err){
 			res.status(500).json({error: err})
 		}
 		res.json({message: "enviado com sucesso.", file: novo});
 	})
}