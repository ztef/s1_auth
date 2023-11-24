/*
 * Copyright (c) Visual Interaction Systems. All rights reserved.
 * Licensed under the MIT License.
 * 
 * Product :  Visual Tracker Application Platform
 * Modulo  :  Proveedor de Autenticacion : Hardcoded
 * 
 */


class SimpleAuthProvider {
    constructor() {
        // Hardcoded user credentials
        this.validUser = {
            username: 'user',
            password: 'pass',
        };

        // Session data
        this.session = {
            isAuthenticated: false,
            user: null,
        };
    }

    login(options = {}) {
        return async (req, res, next) => {

           
            return this.redirectToAuthCodeUrl(
               
            )(req, res, next);
        };
    }

    redirectToAuthCodeUrl() {
        return async (req, res, next) => {
          
                res.redirect('/front/app/main.html');
            
        };
    }

    acquireToken(options = {}) {
        return async (req, res, next) => {
            
    
                res.redirect('/');
            
        };
    }

    handleRedirect(options = {}) {
        return async (req, res, next) => {
            
                res.redirect('/');
            
        }
    }
 
    logout(options = {}) {
        return (req, res, next) => {
             
                res.redirect('/');
        }
    }

    getSession() {
        // Return a copy of the session data
        return { ...this.session };
    }

    // Helper method to check if provided credentials are valid
    isValidCredentials(username, password) {
        return username === this.validUser.username && password === this.validUser.password;
    }
}

module.exports = SimpleAuthProvider;
