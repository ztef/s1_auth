/*------------------------------------------------


Visual Interaction Systems Corp.


Proyecto VISUAL GENERIC SERVER FOR SQL SERVER

Servidor Genérico Backend SQL SERVER v.0.01


Interacciones en back con :

    SQL SERVER


-------------------------------------------------*/



const express = require('express')

const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger'); 

const sql = require('mssql')
var moment = require('moment');
const cors = require('cors');
const fs = require('fs');
const { rawListeners } = require('process');



const sqlconfig = {
  user: 'command_shell',
  password: 'devitnl76',
  port:1483,
  server: '10.26.192.9',    
  database: 'Cubo_CMP',
  requestTimeout: 180000,
  options: {
      encrypt: false,
      useUTC: true
  },
  pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 60000
  }
};





const app = express();
var router = express.Router();


app.use(cors());
app.options('*', cors());
router.use(cors());
app.use("/",router);



app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' "
  );
  res.removeHeader('Server');
  next();
});


function getIP(req) {
 
  const conRemoteAddress = req.connection?.remoteAddress
  // req.socket is said to replace req.connection
  const sockRemoteAddress = req.socket?.remoteAddress
  // some platforms use x-real-ip
  const xRealIP = req.headers['x-real-ip']
  // most proxies use x-forwarded-for
  const xForwardedForIP = (() => {
    const xForwardedFor = req.headers['x-forwarded-for']
    if (xForwardedFor) {
      // The x-forwarded-for header can contain a comma-separated list of
      // IP's. Further, some are comma separated with spaces, so whitespace is trimmed.
      const ips = xForwardedFor.split(',').map(ip => ip.trim())
      return ips[0]
    }
  })()
  // prefer x-forwarded-for and fallback to the others
  return xForwardedForIP || xRealIP || sockRemoteAddress || conRemoteAddress
}



function blockPublicIP(req, res, next) {
  // Get the client's full IP address
  const clientIP = getIP(req);
  console.log("INCOMING ADDRESS:", clientIP);

  // Check for the URL parameter 'user' with the value 'externalAllowed'
  const isExternalAllowed = req.query.user === 'externalAllowed';

  // Split the IP address into its octets
  const octets = clientIP.split('.');

  // Allow requests from the 10.0.0.0/8 range (private IP addresses) and 192.0.0.0/8 range (private IP addresses)
  if (
    (octets.length === 4 && octets[0] === '10') ||
    (octets.length === 4 && octets[0] === '192')
  ) {
    next();
  } else if (isExternalAllowed) {
    // Allow requests with the 'user=externalAllowed' parameter
    next();
  } else if (req.path === '/fillrate' || req.path === '/' || req.path === '/fillrate/' || req.path === '/index.html') { 
    // Block access to specific routes (e.g., '/fillrate') or the root URL ('/')
    return res.status(403).send('Access denied from your IP address: ' + clientIP);
  } else {
    next();
  }
}




//app.use('/', blockPublicIP, express.static('public'));

app.use(express.static('public'));

router.get('/about',(_req, res) => {
    res.sendFile(__dirname + "/main.html");
});

router.get('/query',(_req, res) => {
    res.sendFile(__dirname + "/query.html");
});

router.get('/get',(_req, res) => {
  res.sendFile(__dirname + "/get.html");
});



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


/**
 * @swagger
 * /:
 *   get:
 *     summary: Get information about the API.
 *     description: This is the root endpoint of the API.
 *     responses:
 *       200:
 *         description: Return information about the API.
 */

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Get information about the application.
 *     responses:
 *       200:
 *         description: Return information about the application.
 * /query:
 *   get:
 *     summary: Display the query page.
 *     responses:
 *       200:
 *         description: Return the query page.
 * /get:
 *   get:
 *     summary: Display the get page.
 *     responses:
 *       200:
 *         description: Return the get page.
 * /img/{file}:
 *   get:
 *     summary: Serve an image file.
 *     parameters:
 *       - in: path
 *         name: file
 *         description: The name of the image file.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Return the requested image.
 *       404:
 *         description: Image file not found.
 */





/**
 * @swagger
 * /getData:
 *   get:
 *     summary: Retrieve data from the database.
 *     description: Retrieves data from the database based on the provided query parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         description: The start date for the query.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: fechaFin
 *         description: The end date for the query.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Unidad_de_Negocio:
 *                     type: string
 *                   ZonaTransporte:
 *                     type: string
 *                   Cliente:
 *                     type: string
 *                   Frente:
 *                     type: string
 *                   TipoPedido:
 *                     type: string
 *                   dtDestara:
 *                     type: string
 *                   dtLlegaCte:
 *                     type: string
 *                   CantSolfinal:
 *                     type: string
 *                   CantEntfinal:
 *                     type: string
 *                   Estatus_Entrega_Orig_2:
 *                     type: string
 *                   EstadoZTDem:
 *                     type: string
 *                   RegionZTDem:
 *                     type: string
 *                   vc50_UN_Tact:
 *                     type: string
 *                   GerenciaUN:
 *                     type: string
 *                   Segmento:
 *                     type: string
 *                   AgrupProducto:
 *                     type: string
 *                   Presentacion:
 *                     type: string
 *                   Producto_Tactician:
 *                     type: string
 *                   Año:
 *                     type: string
 *                   Mes:
 *                     type: string
 *       400:
 *         description: Bad request
 */


async function getData(params, outs){

  //.input('fechaInicio', params.fechaInicio)
  //.input('fechaFin',params.fechaFin)


  const q = "select Unidad_de_Negocio, ZonaTransporte, Cliente, Frente, TipoPedido, dtDestara, dtLlegaCte, CantSolfinal, CantEntfinal,Estatus_Entrega_Orig_2,EstadoZTDem, RegionZTDem, vc50_UN_Tact, GerenciaUN, Segmento, AgrupProducto, Presentacion, Producto_Tactician, Año, Mes from Vis_FillRate";
  const w =" where dtDestara between '"+params.fechaInicio+"' and '"+params.fechaFin+"T23:59:59.999Z';"


  try {
  await sql.connect(sqlconfig)

  const result = await sql.query(q+w);

  return(result);



    /*   STREAM
        const request = new sql.Request()
        request.stream = true // You can set streaming differently for each request
        request.query('select TOP 10 * from Vis_FillRate') // or request.execute(procedure)

        outs.write("[")

        request.on('row', row => {
           console.log(JSON.stringify({ result: 'success', msg: 'row', data:row}))
           outs.write(JSON.stringify({ msg: 'row', data:row}))
        })

        request.on('done', result => {
          outs.write("]")
          outs.end()
        })
      */


      //console.log(result)
      //return(result)
  } catch (err) {
    return err
  }
}



/**
 * @swagger
 * /getTable:
 *   get:
 *     summary: Retrieve data from a table.
 *     description: Retrieves data from a specified table based on query parameters.
 *     parameters:
 *       - in: query
 *         name: table
 *         description: The name of the table to query.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: columns
 *         description: The columns to select (comma-separated). If not provided, all columns will be selected.
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: where
 *         description: The WHERE clause for the query. If not provided, no WHERE clause will be applied.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   columnName1:
 *                     type: string
 *                     description: Column1 passed as parameter
 *                   columnName2:
 *                     type: string
 *                     description: Column2 passed as parameter
 *                  
 *       400:
 *         description: Bad request
 */


//Vis_CatRegion, Vis_CatEstado, Vis_CatGerenciaCS, Vis_CatUN_Cemento

async function getTable(params, outs){

  let table = "";

  switch (params.table) {
    case "Vis_CatRegion":
      table = "Vis_CatRegion";
      break;
    case "Vis_CatEstado":
      table="Vis_CatEstado";
      break;
    case "Vis_CatGerenciaCS":
      table = "Vis_CatGerenciaCS";
      break;
    case "Vis_CatUN_Cemento":
      table = "Vis_CatUN_Cemento";
      break;
    
    default:
      table = "";
  }



  if(table != "" ) {

      const f = params.columns === undefined ? "*" : params.columns;
      const q = "select "+f+" from " + table ;
      const w = params.where === undefined ? "" : " where "+params.where;

      console.log("Query:",q+w+";")


      try {
      //await sql.connect('Server=10.26.192.9,1483;Database=Cubo_CMP;User Id=command_shell;Password=devitnl76;Encrypt=false; parseJSON=false ')

      await sql.connect(sqlconfig)
      const result = await sql.query(q+w);

      return(result);




      } catch (err) {
        console.log(err)
        return err
      }
    } else {

      return {}

    }
}




/**
 * @swagger
 * /getSP/VIS_Calcular_OOSFilial:
 *   get:
 *     summary: Execute VIS_Calcular_OOSFilial stored procedure.
 *     description: Execute the VIS_Calcular_OOSFilial stored procedure with the provided parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date for the query.
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *         description: End date for the query.
 *       - in: query
 *         name: RegionZTDem
 *         schema:
 *           type: string
 *         description: RegionZTDem parameter description.
 *       - in: query
 *         name: EstadoZTDem
 *         schema:
 *           type: string
 *         description: EstadoZTDem parameter description.
 *       - in: query
 *         name: ZonaTransporte
 *         schema:
 *           type: string
 *         description: ZonaTransporte parameter description.
 *       - in: query
 *         name: Cliente
 *         schema:
 *           type: string
 *         description: Cliente parameter description.
 *       - in: query
 *         name: Nombre_Cliente
 *         schema:
 *           type: string
 *         description: Nombre_Cliente parameter description.
 *       - in: query
 *         name: Obra
 *         schema:
 *           type: string
 *         description: Obra parameter description.
 *       - in: query
 *         name: Nombre_Obra
 *         schema:
 *           type: string
 *         description: Nombre_Obra parameter description.
 *       - in: query
 *         name: Frente
 *         schema:
 *           type: string
 *         description: Frente parameter description.
 *       - in: query
 *         name: Nombre_Frente
 *         schema:
 *           type: string
 *         description: Nombre_Frente parameter description.
 *       - in: query
 *         name: Segmento
 *         schema:
 *           type: string
 *         description: Segmento parameter description.
 *       - in: query
 *         name: AgrupProducto
 *         schema:
 *           type: string
 *         description: AgrupProducto parameter description.
 *       - in: query
 *         name: Presentacion
 *         schema:
 *           type: string
 *         description: Presentacion parameter description.
 *       - in: query
 *         name: Producto_Tactician
 *         schema:
 *           type: string
 *         description: Producto_Tactician parameter description.
 *       - in: query
 *         name: vc50_Region_UN
 *         schema:
 *           type: string
 *         description: vc50_Region_UN parameter description.
 *       - in: query
 *         name: GerenciaUN
 *         schema:
 *           type: string
 *         description: GerenciaUN parameter description.
 *       - in: query
 *         name: vc50_UN_Tact
 *         schema:
 *           type: string
 *         description: vc50_UN_Tact parameter description.
 *       - in: query
 *         name: masivos
 *         schema:
 *           type: string
 *         description: masivos parameter description.
 *     responses:
 *       200:
 *         description: Successfully executed the stored procedure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columnName1:
 *                   type: string
 *                   description: Description of the first column.
 *                 columnName2:
 *                   type: number
 *                   description: Description of the second column.
 *                 
 *               example:
 *                 columnName1: ExampleValue1
 *                 columnName2: 42
 *       500:
 *         description: Internal server error.
 */


async function getVIS_Calcular_OOSFilial(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {


      var fechaInicio = params.fechaInicio;
      var fechaFin = params.fechaFin;

       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       var masivos  =  params.masivos === undefined ? null : params.masivos;

      // Stored procedure

      var r = pool.request()
      .input('fechaInicio', params.fechaInicio)
      .input('fechaFin', params.fechaFin)
      .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          .input('masivos', masivos)
      
      .execute('VIS_Calcular_OOSFilial');

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}

/**
 * @swagger
 * /getSP/VIS_Calcular_FillRate_conParams:
 *   get:
 *     summary: Execute VIS_Calcular_FillRate_conParams stored procedure.
 *     description: Execute the VIS_Calcular_FillRate_conParams stored procedure with the provided parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date for the query.
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *         description: End date for the query.
 *       - in: query
 *         name: RegionZTDem
 *         schema:
 *           type: string
 *         description: RegionZTDem parameter description.
 *       - in: query
 *         name: EstadoZTDem
 *         schema:
 *           type: string
 *         description: EstadoZTDem parameter description.
 *       - in: query
 *         name: ZonaTransporte
 *         schema:
 *           type: string
 *         description: ZonaTransporte parameter description.
 *       - in: query
 *         name: Cliente
 *         schema:
 *           type: string
 *         description: Cliente parameter description.
 *       - in: query
 *         name: Nombre_Cliente
 *         schema:
 *           type: string
 *         description: Nombre_Cliente parameter description.
 *       - in: query
 *         name: Obra
 *         schema:
 *           type: string
 *         description: Obra parameter description.
 *       - in: query
 *         name: Nombre_Obra
 *         schema:
 *           type: string
 *         description: Nombre_Obra parameter description.
 *       - in: query
 *         name: Frente
 *         schema:
 *           type: string
 *         description: Frente parameter description.
 *       - in: query
 *         name: Nombre_Frente
 *         schema:
 *           type: string
 *         description: Nombre_Frente parameter description.
 *       - in: query
 *         name: Segmento
 *         schema:
 *           type: string
 *         description: Segmento parameter description.
 *       - in: query
 *         name: AgrupProducto
 *         schema:
 *           type: string
 *         description: AgrupProducto parameter description.
 *       - in: query
 *         name: Presentacion
 *         schema:
 *           type: string
 *         description: Presentacion parameter description.
 *       - in: query
 *         name: Producto_Tactician
 *         schema:
 *           type: string
 *         description: Producto_Tactician parameter description.
 *       - in: query
 *         name: vc50_Region_UN
 *         schema:
 *           type: string
 *         description: vc50_Region_UN parameter description.
 *       - in: query
 *         name: GerenciaUN
 *         schema:
 *           type: string
 *         description: GerenciaUN parameter description.
 *       - in: query
 *         name: vc50_UN_Tact
 *         schema:
 *           type: string
 *         description: vc50_UN_Tact parameter description.
 *       - in: query
 *         name: masivos
 *         schema:
 *           type: string
 *         description: masivos parameter description.
 *     responses:
 *       200:
 *         description: Successfully executed the stored procedure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columnName1:
 *                   type: string
 *                   description: Description of the first column.
 *                 columnName2:
 *                   type: number
 *                   description: Description of the second column.
 *                 
 *               example:
 *                 columnName1: ExampleValue1
 *                 columnName2: 42
 *       500:
 *         description: Internal server error.
 */

async function getVIS_Calcular_FillRate_conParams(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {


      var fechaInicio = params.fechaInicio;
      var fechaFin = params.fechaFin;

       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       var masivos  =  params.masivos === undefined ? null : params.masivos;


      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', params.fechaInicio)
          .input('fechaFin', params.fechaFin)
          .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          .input('masivos', masivos)
          .execute('VIS_Calcular_FillRate_conParams')
      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}



/**
 * @swagger
 * /getSP/VIS_Calcular_FillRate:
 *   get:
 *     summary: Execute VIS_Calcular_FillRate stored procedure.
 *     description: Execute the VIS_Calcular_FillRate stored procedure with the provided parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date for the query.
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *         description: End date for the query.
 *     responses:
 *       200:
 *         description: Successfully executed the stored procedure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columnName1:
 *                   type: string
 *                   description: Description of the first column.
 *                 columnName2:
 *                   type: number
 *                   description: Description of the second column.
 *                 
 *               example:
 *                 columnName1: ExampleValue1
 *                 columnName2: 42
 *       500:
 *         description: Internal server error.
 * 
 * /getSP/VIS_Calcular_FillRate_2:
 *   get:
 *     summary: Execute VIS_Calcular_FillRate_2 stored procedure.
 *     description: Execute the VIS_Calcular_FillRate_2 stored procedure with the provided parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date for the query.
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *         description: End date for the query.
 *     responses:
 *       200:
 *         description: Successfully executed the stored procedure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columnName1:
 *                   type: string
 *                   description: Description of the first column.
 *                 columnName2:
 *                   type: number
 *                   description: Description of the second column.
 *                
 *               example:
 *                 columnName1: ExampleValue1
 *                 columnName2: 42
 *       500:
 *         description: Internal server error.
 */




//Stored Procedure Fillrate

async function getVIS_Calcular_FillRate(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {


      var fechaInicio = params.fechaInicio;
      var fechaFin = params.fechaFin;



      // Stored procedure

      var r = pool.request().input('fechaInicio', fechaInicio).input('fechaFin', fechaFin).execute('VIS_Calcular_FillRate');
          
      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}

/**
 * @swagger
 * /getSP/VIS_ObtenerFechas:
 *   get:
 *     summary: Execute VIS_ObtenerFechas stored procedure.
 *     description: Execute the VIS_ObtenerFechas stored procedure with the provided parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date for the query.
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *         description: End date for the query.
 *       - in: query
 *         name: Pantalla
 *         schema:
 *           type: string
 *         description: Pantalla parameter description.
 *     responses:
 *       200:
 *         description: Successfully executed the stored procedure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columnName1:
 *                   type: string
 *                   description: Description of the first column.
 *                 columnName2:
 *                   type: number
 *                   description: Description of the second column.
 *                
 *               example:
 *                 columnName1: ExampleValue1
 *                 columnName2: 42
 *       500:
 *         description: Internal server error.
 */

async function getVIS_ObtenerFechas(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {


      var fechaInicio = params.fechaInicio;
      var fechaFin = params.fechaFin;
      var Pantalla = Pantalla;


      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', fechaInicio)
          .input('fechaFin', fechaFin)
          .input('Pantalla', Pantalla)
          .execute('VIS_ObtenerFechas');
          
      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}





/**
 * @swagger
 * /getSP/VIS_GetFrentes_FillRate:
 *   get:
 *     summary: Execute VIS_GetFrentes_FillRate stored procedure.
 *     description: Execute the VIS_GetFrentes_FillRate stored procedure with the provided parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date for the query.
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *         description: End date for the query.
 *       - in: query
 *         name: agrupador
 *         required: true
 *         schema:
 *           type: string
 *         description: Grouping parameter.
 *     responses:
 *       200:
 *         description: Successfully executed the stored procedure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columnName1:
 *                   type: string
 *                   description: Description of the first column.
 *                 columnName2:
 *                   type: number
 *                   description: Description of the second column.
 *                 
 *               example:
 *                 columnName1: ExampleValue1
 *                 columnName2: 42
 *       500:
 *         description: Internal server error.
 */





//VIS_GetFrentes_FillRate

async function VIS_GetFrentes_FillRate(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {


      var fechaInicio = params.fechaInicio;
      var fechaFin = params.fechaFin;



      // Stored procedure

      var r = pool.request().input('fechaInicio', fechaInicio).input('fechaFin', fechaFin).input('agrupador', agrupador).execute('VIS_GetFrentes_FillRate');
          
      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}




/**
 * @swagger
 * /getSP/VIS_Calcular_KPI_Abasto_FillRate:
 *   get:
 *     summary: Execute VIS_Calcular_KPI_Abasto_FillRate stored procedure.
 *     description: Execute the specified stored procedure with the provided parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date for the query.
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *         description: End date for the query.
 *       - in: query
 *         name: agrupador
 *         required: true
 *         schema:
 *           type: string
 *         description: Grouping parameter.
 *       - in: query
 *         name: RegionZTDem
 *         schema:
 *           type: string
 *         description: RegionZTDem parameter.
 *       - in: query
 *         name: EstadoZTDem
 *         schema:
 *           type: string
 *         description: EstadoZTDem parameter.
 *       - in: query
 *         name: ZonaTransporte
 *         schema:
 *           type: string
 *         description: ZonaTransporte parameter.
 *       - in: query
 *         name: Cliente
 *         schema:
 *           type: string
 *         description: Cliente parameter.
 *       - in: query
 *         name: Nombre_Cliente
 *         schema:
 *           type: string
 *         description: Nombre_Cliente parameter.
 *       - in: query
 *         name: Obra
 *         schema:
 *           type: string
 *         description: Obra parameter.
 *       - in: query
 *         name: Nombre_Obra
 *         schema:
 *           type: string
 *         description: Nombre_Obra parameter.
 *       - in: query
 *         name: Frente
 *         schema:
 *           type: string
 *         description: Frente parameter.
 *       - in: query
 *         name: Nombre_Frente
 *         schema:
 *           type: string
 *         description: Nombre_Frente parameter.
 *       - in: query
 *         name: Segmento
 *         schema:
 *           type: string
 *         description: Segmento parameter.
 *       - in: query
 *         name: AgrupProducto
 *         schema:
 *           type: string
 *         description: AgrupProducto parameter.
 *       - in: query
 *         name: Presentacion
 *         schema:
 *           type: string
 *         description: Presentacion parameter.
 *       - in: query
 *         name: Producto_Tactician
 *         schema:
 *           type: string
 *         description: Producto_Tactician parameter.
 *       - in: query
 *         name: vc50_Region_UN
 *         schema:
 *           type: string
 *         description: vc50_Region_UN parameter.
 *       - in: query
 *         name: GerenciaUN
 *         schema:
 *           type: string
 *         description: GerenciaUN parameter.
 *       - in: query
 *         name: vc50_UN_Tact
 *         schema:
 *           type: string
 *         description: vc50_UN_Tact parameter.
 *       - in: query
 *         name: masivos
 *         schema:
 *           type: string
 *         description: masivos parameter.
 *     responses:
 *       200:
 *         description: Successfully executed the stored procedure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columnName1:
 *                   type: string
 *                   description: Description of the first column.
 *                 columnName2:
 *                   type: number
 *                   description: Description of the second column.
 *                
 *               example:
 *                 columnName1: ExampleValue1
 *                 columnName2: 42
 *       500:
 *         description: Internal server error.
 */


async function getVIS_Calcular_KPI_Abasto_FillRate(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {



       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       var masivos  =  params.masivos === undefined ? null : params.masivos;


      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', params.fechaInicio)
          .input('fechaFin',params.fechaFin)
          .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          .input('masivos', masivos)





          //.output('output_parameter', sql.VarChar(50))
          .execute('VIS_Calcular_KPI_Abasto_FillRate')

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}

async function getVIS_Calcular_KPI_Abasto_FillRate_Nuevo(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {



       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       var masivos  =  params.masivos === undefined ? null : params.masivos;


      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', params.fechaInicio)
          .input('fechaFin',params.fechaFin)
          .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          .input('masivos', masivos)





          //.output('output_parameter', sql.VarChar(50))
          .execute('VIS_Calcular_KPI_Abasto_FillRate_Nuevo')

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}

/**
 * @swagger
 * /getSP/Generico:
 *   get:
 *     summary: Execute a generic stored procedure.
 *     description: Executes a generic stored procedure based on query parameters.
 *     parameters:
 *       - in: query
 *         name: spname
 *         description: The name of the stored procedure to execute.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: fechaInicio
 *         description: The start date for filtering data.
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fechaFin
 *         description: The end date for filtering data.
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: agrupador
 *         description: An optional parameter for grouping data.
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: RegionZTDem
 *         description: The value of RegionZTDem.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: EstadoZTDem
 *         description: The value of EstadoZTDem.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: ZonaTransporte
 *         description: The value of ZonaTransporte.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: Cliente
 *         description: The value of Cliente.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: Nombre_Cliente
 *         description: The value of Nombre_Cliente.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: Obra
 *         description: The value of Obra.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: Nombre_Obra
 *         description: The value of Nombre_Obra.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: Frente
 *         description: The value of Frente.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: Nombre_Frente
 *         description: The value of Nombre_Frente.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: Segmento
 *         description: The value of Segmento.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: AgrupProducto
 *         description: The value of AgrupProducto.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: Presentacion
 *         description: The value of Presentacion.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: Producto_Tactician
 *         description: The value of Producto_Tactician.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: vc50_Region_UN
 *         description: The value of vc50_Region_UN.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: GerenciaUN
 *         description: The value of GerenciaUN.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *       - in: query
 *         name: vc50_UN_Tact
 *         description: The value of vc50_UN_Tact.
 *         required: false
 *         schema:
 *           type: string
 *           nullable: true
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 property1:
 *                   type: string
 *                   description: Description for property1 (replace with actual output property name)
 *                 property2:
 *                   type: string
 *                   description: Description for property2 (replace with actual output property name)
 *                 RegionZTDem:
 *                   type: string | null
 *                   description: The value of RegionZTDem (replace with a meaningful description)
 *                 EstadoZTDem:
 *                   type: string | null
 *                   description: The value of EstadoZTDem (replace with a meaningful description)
 *                 ZonaTransporte:
 *                   type: string | null
 *                   description: The value of ZonaTransporte (replace with a meaningful description)
 *                 Cliente:
 *                   type: string | null
 *                   description: The value of Cliente (replace with a meaningful description)
 *                 Nombre_Cliente:
 *                   type: string | null
 *                   description: The value of Nombre_Cliente (replace with a meaningful description)
 *                 Obra:
 *                   type: string | null
 *                   description: The value of Obra (replace with a meaningful description)
 *                 Nombre_Obra:
 *                   type: string | null
 *                   description: The value of Nombre_Obra (replace with a meaningful description)
 *                 Frente:
 *                   type: string | null
 *                   description: The value of Frente (replace with a meaningful description)
 *                 Nombre_Frente:
 *                   type: string | null
 *                   description: The value of Nombre_Frente (replace with a meaningful description)
 *                 Segmento:
 *                   type: string | null
 *                   description: The value of Segmento (replace with a meaningful description)
 *                 AgrupProducto:
 *                   type: string | null
 *                   description: The value of AgrupProducto (replace with a meaningful description)
 *                 Presentacion:
 *                   type: string | null
 *                   description: The value of Presentacion (replace with a meaningful description)
 *                 Producto_Tactician:
 *                   type: string | null
 *                   description: The value of Producto_Tactician (replace with a meaningful description)
 *                 vc50_Region_UN:
 *                   type: string | null
 *                   description: The value of vc50_
*/




async function getVIS_Calcular_KPI_Generico(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {



       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       

      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', params.fechaInicio)
          .input('fechaFin',params.fechaFin)
          .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          
          

          //.output('output_parameter', sql.VarChar(50))
          .execute(params.spname)

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}




/**
 * @swagger
 * /getSP/Cadena/Generico:
 *   get:
 *     summary: Execute a generic stored procedure.
 *     description: Executes a generic stored procedure based on query parameters.
 *     parameters:
 *       - in: query
 *         name: spname
 *         description: The name of the stored procedure to execute.
 *         required: true
 *         schema:
 *           type: string
 *       # Add any other input parameters if needed
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 property1:
 *                   type: string
 *                   description: Please read the Stored Procedure response documentation
 *                 property2:
 *                   type: string
 *                   description: Please read the Stored Procedure response documentation
 *                
 *       400:
 *         description: Bad request
 */




async function getVIS_Calcular_Cadena_Generico(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {



       //var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
      //

      // Stored procedure

      var r = pool.request()
         // .input('fechaInicio', params.fechaInicio)


          //.output('output_parameter', sql.VarChar(50))
          .execute(params.spname)

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}



/**
 * @swagger
 * /getSP/VIS_Calcular_KPI_Produccion_FillRate:
 *   get:
 *     summary: Execute VIS_Calcular_KPI_Produccion_FillRate stored procedure.
 *     description: Execute the specified stored procedure with the provided parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date for the query.
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *         description: End date for the query.
 *       - in: query
 *         name: agrupador
 *         required: true
 *         schema:
 *           type: string
 *         description: Grouping parameter.
 *       - in: query
 *         name: RegionZTDem
 *         schema:
 *           type: string
 *         description: RegionZTDem parameter.
 *       - in: query
 *         name: EstadoZTDem
 *         schema:
 *           type: string
 *         description: EstadoZTDem parameter.
 *       - in: query
 *         name: ZonaTransporte
 *         schema:
 *           type: string
 *         description: ZonaTransporte parameter.
 *       - in: query
 *         name: Cliente
 *         schema:
 *           type: string
 *         description: Cliente parameter.
 *       - in: query
 *         name: Nombre_Cliente
 *         schema:
 *           type: string
 *         description: Nombre_Cliente parameter.
 *       - in: query
 *         name: Obra
 *         schema:
 *           type: string
 *         description: Obra parameter.
 *       - in: query
 *         name: Nombre_Obra
 *         schema:
 *           type: string
 *         description: Nombre_Obra parameter.
 *       - in: query
 *         name: Frente
 *         schema:
 *           type: string
 *         description: Frente parameter.
 *       - in: query
 *         name: Nombre_Frente
 *         schema:
 *           type: string
 *         description: Nombre_Frente parameter.
 *       - in: query
 *         name: Segmento
 *         schema:
 *           type: string
 *         description: Segmento parameter.
 *       - in: query
 *         name: AgrupProducto
 *         schema:
 *           type: string
 *         description: AgrupProducto parameter.
 *       - in: query
 *         name: Presentacion
 *         schema:
 *           type: string
 *         description: Presentacion parameter.
 *       - in: query
 *         name: Producto_Tactician
 *         schema:
 *           type: string
 *         description: Producto_Tactician parameter.
 *       - in: query
 *         name: vc50_Region_UN
 *         schema:
 *           type: string
 *         description: vc50_Region_UN parameter.
 *       - in: query
 *         name: GerenciaUN
 *         schema:
 *           type: string
 *         description: GerenciaUN parameter.
 *       - in: query
 *         name: vc50_UN_Tact
 *         schema:
 *           type: string
 *         description: vc50_UN_Tact parameter.
 *       - in: query
 *         name: masivos
 *         schema:
 *           type: string
 *         description: masivos parameter.
 *     responses:
 *       200:
 *         description: Successfully executed the stored procedure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columnName1:
 *                   type: string
 *                   description: Description of the first column.
 *                 columnName2:
 *                   type: number
 *                   description: Description of the second column.
 *                  
 *               example:
 *                 columnName1: ExampleValue1
 *                 columnName2: 42
 *       500:
 *         description: Internal server error.
 */




async function getVIS_Calcular_KPI_Produccion_FillRate(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {



       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       var masivos  =  params.masivos === undefined ? null : params.masivos;

      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', params.fechaInicio)
          .input('fechaFin',params.fechaFin)
          .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          .input('masivos', masivos)




          //.output('output_parameter', sql.VarChar(50))
          .execute('VIS_Calcular_KPI_Produccion_FillRate')

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}



/**
 * @swagger
 * /getSP/VIS_Calcular_KPI_PedidosPendientes_Estado:
 *   get:
 *     summary: Execute VIS_Calcular_KPI_PedidosPendientes_Estado stored procedure.
 *     description: Execute the VIS_Calcular_KPI_PedidosPendientes_Estado stored procedure with the provided parameters.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date for the query.
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *         description: End date for the query.
 *       - in: query
 *         name: RegionZTDem
 *         schema:
 *           type: string
 *         description: RegionZTDem parameter description.
 *       - in: query
 *         name: EstadoZTDem
 *         schema:
 *           type: string
 *         description: EstadoZTDem parameter description.
 *       - in: query
 *         name: ZonaTransporte
 *         schema:
 *           type: string
 *         description: ZonaTransporte parameter description.
 *       - in: query
 *         name: Cliente
 *         schema:
 *           type: string
 *         description: Cliente parameter description.
 *       - in: query
 *         name: Nombre_Cliente
 *         schema:
 *           type: string
 *         description: Nombre_Cliente parameter description.
 *       - in: query
 *         name: Obra
 *         schema:
 *           type: string
 *         description: Obra parameter description.
 *       - in: query
 *         name: Nombre_Obra
 *         schema:
 *           type: string
 *         description: Nombre_Obra parameter description.
 *       - in: query
 *         name: Frente
 *         schema:
 *           type: string
 *         description: Frente parameter description.
 *       - in: query
 *         name: Nombre_Frente
 *         schema:
 *           type: string
 *         description: Nombre_Frente parameter description.
 *       - in: query
 *         name: Segmento
 *         schema:
 *           type: string
 *         description: Segmento parameter description.
 *       - in: query
 *         name: AgrupProducto
 *         schema:
 *           type: string
 *         description: AgrupProducto parameter description.
 *       - in: query
 *         name: Presentacion
 *         schema:
 *           type: string
 *         description: Presentacion parameter description.
 *       - in: query
 *         name: Producto_Tactician
 *         schema:
 *           type: string
 *         description: Producto_Tactician parameter description.
 *       - in: query
 *         name: vc50_Region_UN
 *         schema:
 *           type: string
 *         description: vc50_Region_UN parameter description.
 *       - in: query
 *         name: GerenciaUN
 *         schema:
 *           type: string
 *         description: GerenciaUN parameter description.
 *       - in: query
 *         name: vc50_UN_Tact
 *         schema:
 *           type: string
 *         description: vc50_UN_Tact parameter description.
 *       - in: query
 *         name: masivos
 *         schema:
 *           type: string
 *         description: masivos parameter description.
 *       - in: query
 *         name: idSpider
 *         schema:
 *           type: string
 *         description: idSpider parameter description.
 *     responses:
 *       200:
 *         description: Successfully executed the stored procedure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columnName1:
 *                   type: string
 *                   description: Description of the first column.
 *                 columnName2:
 *                   type: number
 *                   description: Description of the second column.
 *                
 *               example:
 *                 columnName1: ExampleValue1
 *                 columnName2: 42
 *       500:
 *         description: Internal server error.
 */

async function getVIS_Calcular_KPI_PedidosPendientes_Estado(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {



       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       var masivos  =  params.masivos === undefined ? null : params.masivos;
       var idSpider  =  params.idSpider === undefined ? null : params.idSpider;

      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', params.fechaInicio)
          .input('fechaFin',params.fechaFin)
          .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          .input('masivos', masivos)
          .input('idSpider', idSpider)




          //.output('output_parameter', sql.VarChar(50))
          .execute('VIS_Calcular_KPI_PedidosPendientes_Estado')

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }

  );

  return (r)
}


async function getVIS_Calcular_KPI_Produccion_FillRate_Nuevo(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {



       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       var masivos  =  params.masivos === undefined ? null : params.masivos;

      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', params.fechaInicio)
          .input('fechaFin',params.fechaFin)
          .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          .input('masivos', masivos)




          //.output('output_parameter', sql.VarChar(50))
          .execute('VIS_Calcular_KPI_Produccion_FillRate_Nuevo')

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }



  );


  return (r)



}

async function getVIS_Calcular_KPI_Flota_FillRate_PorDia(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {



       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       var masivos  =  params.masivos === undefined ? null : params.masivos;
       var idSpider  =  params.idSpider === undefined ? null : params.idSpider;

      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', params.fechaInicio)
          .input('fechaFin',params.fechaFin)
          .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          .input('masivos', masivos)
          .input('idSpider', idSpider)




          //.output('output_parameter', sql.VarChar(50))
          .execute('VIS_Calcular_KPI_Flota_FillRate_PorDia')

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }

  );

  return (r)
}

async function getVIS_Calcular_KPI_Venta_FillRate_porDia(params, outs){



  var r = await sql.connect(sqlconfig).then(
    pool => {



       var RegionZTDem  = params.RegionZTDem === undefined ? null : params.RegionZTDem;
       var EstadoZTDem  =  params.EstadoZTDem === undefined ? null : params.EstadoZTDem;
       var ZonaTransporte  =  params. ZonaTransporte === undefined ? null : params. ZonaTransporte;
       var Cliente =  params.Cliente === undefined ? null : params.Cliente;
       var Nombre_Cliente  =  params.Nombre_Cliente === undefined ? null : params.Nombre_Cliente;
       var Obra  =  params.Obra === undefined ? null : params.Obra
       var Nombre_Obra  =  params.Nombre_Obra === undefined ? null : params.Nombre_Obra;
       var Frente  =  params.Frente  === undefined ? null : params.Frente ;
       var Nombre_Frente  =  params.Nombre_Frente === undefined ? null : params.Nombre_Frente;
       var Segmento  =  params.Segmento === undefined ? null : params.Segmento;
       var AgrupProducto  =  params.AgrupProducto === undefined ? null : params.AgrupProducto;
       var Presentacion  =  params.Presentacion === undefined ? null : params.Presentacion;
       var Producto_Tactician  =  params.Producto_Tactician === undefined ? null : params.Producto_Tactician;
       var vc50_Region_UN  =  params.vc50_Region_UN === undefined ? null : params.vc50_Region_UN;
       var GerenciaUN  =  params.GerenciaUN === undefined ? null : params.GerenciaUN;
       var vc50_UN_Tact  =  params.vc50_UN_Tact === undefined ? null : params.vc50_UN_Tact;
       var masivos  =  params.masivos === undefined ? null : params.masivos;
       var idSpider  =  params.idSpider === undefined ? null : params.idSpider;

      // Stored procedure

      var r = pool.request()
          .input('fechaInicio', params.fechaInicio)
          .input('fechaFin',params.fechaFin)
          .input('agrupador',params.agrupador)
          .input('RegionZTDem' , RegionZTDem)
          .input('EstadoZTDem', EstadoZTDem)
          .input('ZonaTransporte', ZonaTransporte)
          .input('Cliente', Cliente)
          .input('Nombre_Cliente', Nombre_Cliente)
          .input('Obra', Obra)
          .input('Nombre_Obra',Nombre_Obra)
          .input('Frente', Frente)
          .input('Nombre_Frente', Nombre_Frente)
          .input('Segmento', Segmento)
          .input('AgrupProducto', AgrupProducto)
          .input('Presentacion',Presentacion)
          .input('Producto_Tactician', Producto_Tactician)
          .input('vc50_Region_UN', vc50_Region_UN)
          .input('GerenciaUN', GerenciaUN )
          .input('vc50_UN_Tact', vc50_UN_Tact)
          .input('masivos', masivos)
          .input('idSpider', idSpider)




          //.output('output_parameter', sql.VarChar(50))
          .execute('VIS_Calcular_KPI_Venta_FillRate_porDia')

      return (r)
  }
  ).then(
    result => {
      console.dir(result)
      return(result)

  }
  ).catch(
    err => {
     console.log(err)
  }

  );

  return (r)
}

  //ROUTER'S

  // Obtener Fechas

router.get(['/getSP/VIS_ObtenerFechas'],(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ********");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_ObtenerFechas(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

// Flota por dia

router.get(['/getSP/VIS_Calcular_KPI_Venta_FillRate_porDia'],(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ********");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_KPI_Venta_FillRate_porDia(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

// Flota por dia

router.get(['/getSP/VIS_Calcular_KPI_Flota_FillRate_PorDia'],(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ********");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_KPI_Flota_FillRate_PorDia(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

// Pedidos Pendientes

router.get(['/getSP/VIS_Calcular_KPI_PedidosPendientes_Estado'],(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ********");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_KPI_PedidosPendientes_Estado(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});


//OOS Filial
router.get(['/getSP/VIS_Calcular_OOSFilial'],(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ********");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_OOSFilial(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

//Fillrate con Parametros

router.get('/getSP/VIS_Calcular_FillRate_conParams',(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ********");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_FillRate_conParams(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});


//Alias

router.get(['/getSP/VIS_Calcular_FillRate','/getSP/VIS_Calcular_FillRate_2'],(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ********");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_FillRate(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

//Alias

router.get(['/getSP/VIS_GetFrentes_FillRate'],(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ********");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  VIS_GetFrentes_FillRate(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

router.get('/getSP/VIS_Calcular_KPI_Abasto_FillRate',(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_KPI_Abasto_FillRate(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

router.get('/getSP/VIS_Calcular_KPI_Produccion_FillRate',(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP Produccion: ");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_KPI_Produccion_FillRate(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

router.get('/getSP/VIS_Calcular_KPI_Produccion_FillRate_Nuevo',(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP Produccion: ");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_KPI_Produccion_FillRate_Nuevo(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

router.get('/getSP/VIS_Calcular_KPI_Abasto_FillRate',(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_KPI_Abasto_FillRate(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});

router.get('/getSP/VIS_Calcular_KPI_Abasto_FillRate_Nuevo',(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP Produccion: ");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_KPI_Abasto_FillRate_Nuevo(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});


router.get('/getSP/Generico',(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP Generico: ");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_KPI_Generico(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            
            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

    });


});


router.get('/getSP/Cadena/Generico',(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP Generico: ");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getVIS_Calcular_Cadena_Generico(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo SP Cadena  en : ", fin.diff(inicio));

    });


});








router.get('/getTable',(req, res) => {

  let inicio = moment();
  console.log("Llamada a getTable: ");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getTable(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()
            try{
             if(datos=== undefined){
                res.end(JSON.stringify({'error':'timeout'}))
              } else {
                res.end(JSON.stringify(datos))

              }
            } catch {
              res.end(JSON.stringify({'error':'timeout'}))
            }

            let fin = moment()
            console.log("Respondiendo getTable en : ", fin.diff(inicio));

    });


});




router.get('/getData',(req, res) => {

  let inicio = moment();
  console.log("Recibiendo query : ");
  console.log(req.query);

  res.setHeader('Content-Type', 'application/json');

  getData(req.query,res).then((datos)=>{

            res.setHeader('Content-Type', 'application/json');

            let medio = moment()

            if(datos.recordset === undefined){
              res.end(JSON.stringify({'error':'timeout'}))
            } else {
              res.end(JSON.stringify(datos.recordset))
            }


            let fin = moment()
            console.log("Respondiendo query en : ", fin.diff(inicio));

    });


});





app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// abasto, producc, ventas, oos, deficit flota
// fill rate tabla
// pedidos pend tabla
// masivos < fill rate

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`VisualCEMEX Middleware Server , corriendo escuchando en puerto : ${port}!`);
});
