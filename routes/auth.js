/*
 * Copyright (c) Visual Interaction Systems. All rights reserved.
 * Licensed under the MIT License.
 * 
 * Product :  Visual Tracker Application Platform
 * Modulo  :  Router de Autenticacion
 * 
 */

var express = require('express');

const AuthProviderFactory = require('../auth/AuthProviderFactory');

// Use AzureAuthProvider Simple | azure
const authProvider = AuthProviderFactory.createProvider('simple');


const { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require('../AzureAuthConfig');

const router = express.Router();

router.get('/signin', authProvider.login({
    scopes: [],
    redirectUri: REDIRECT_URI,
    successRedirect: '/'
}));

router.get('/acquireToken', authProvider.acquireToken({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
    successRedirect: '/users/profile'
}));

router.post('/redirect', authProvider.handleRedirect());

router.get('/signout', authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI
}));

module.exports = router;
