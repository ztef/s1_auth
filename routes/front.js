/*
 * Copyright (c) Visual Interaction Systems. All rights reserved.
 * Licensed under the MIT License.
 * 
 * Product :  Visual Tracker Application Platform
 * Modulo  :  Router de Aplicativo Front
 * 
 */

var express = require('express');
var router = express.Router();

router.use(express.static('front'));

router.get('/img/:file', (_req,res) => {

    console.log("Solicitud de img : ");
    console.log(_req.params.file);
  
    fs.readFile('./img/' + _req.params.file, function(err, data) {
      if(err) {
        res.send("Archivo no encontrado.");
      } else {
        // set the content type based on the file
        res.contentType(_req.params.file);
        res.send(data);
      }
      res.end();
    });
  
  }
  );


router.get('/about',(_req, res) => {
    res.sendFile(__dirname + "/main.html");
});

router.get('/query',(_req, res) => {
    res.sendFile(__dirname + "/query.html");
});

router.get('/get',(_req, res) => {
  res.sendFile(__dirname + "/get.html");
});


module.exports = router;
