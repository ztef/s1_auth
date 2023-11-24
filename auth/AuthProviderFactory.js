/*
 * Copyright (c) Visual Interaction Systems. All rights reserved.
 * Licensed under the MIT License.
 * 
 * Product :  Visual Tracker Application Platform
 * Modulo  :  Fabrica de Proveedores de Autenticacion 
 * 
 */



const AzureAuthProvider = require('./AzureAuthProvider');  
const SimpleAuthProvider = require('./SimpleAuthProvider'); 

class AuthProviderFactory {
    static createProvider(type) {
        switch (type) {
            case 'azure':
                const { msalConfig } = require('../AzureAuthConfig');
                return new AzureAuthProvider(msalConfig);
            case 'simple':
                return new SimpleAuthProvider();
            default:
                throw new Error(`Invalid authentication provider type: ${type}`);
        }
    }
}

module.exports = AuthProviderFactory;
