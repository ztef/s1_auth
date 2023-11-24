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






module.exports = router;
