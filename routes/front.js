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


const isAuthenticated = (req, res, next) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, proceed to the next middleware
    } else {
      // User is not authenticated, handle accordingly (e.g., redirect to login)
      res.redirect('/auth/signin');
    }
  };


router.use(isAuthenticated);
router.use(express.static('front'));


module.exports = router;
