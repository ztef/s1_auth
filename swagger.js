const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CEMEX Visualcemex backend API',
      version: '1.0.0',
      description: 'Visualcemex API',
    },
  },
  apis: ['./app.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;
