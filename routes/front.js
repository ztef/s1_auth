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


function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }

    next();
};

router.use(isAuthenticated);
router.use(express.static('front'));


module.exports = router;
