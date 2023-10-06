/*
Visual Interaction Systems Corp.


Proyecto VISUAL GENERIC SERVER FOR SQL SERVER

Servidor Genérico Backend SQL SERVER v.0.01


Interacciones en back con :

    SQL SERVER


*/



const express = require('express')
const sql = require('mssql')
var moment = require('moment');
const cors = require('cors');
const fs = require('fs');
const { rawListeners } = require('process');

// await sql.connect('Server=10.26.192.9,1483;Database=Cubo_CMP;User Id=command_shell;Password=devitnl76;Encrypt=false; parseJSON=false ')


const sqlconfig = {
  user: 'command_shell',
  password: 'devitnl76',
  port:1483,
  server: '10.26.192.9',    //if your connecting to localhost\instance make sure you have the service 'SQL Server Browser' running.
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


function blockPublicIP(req, res, next) {
  const clientIP = req.ip; // Get the client's IP address from the request

  // Check for the URL parameter 'user' with the value 'externalAllowed'
  const isExternalAllowed = req.query.user === 'externalAllowed';

  // Split the IP address into its octets
  const octets = clientIP.split('.');
  
  // Allow requests from the 10.0.0.0/8 range (private IP addresses)
  if (octets.length === 4 && octets[0] === '10') {
    next();
  } else if (isExternalAllowed) {
    // Allow requests with the 'user=externalAllowed' parameter
    next();
  } else {
    // Block all other requests
    return res.status(403).send('Access denied from your IP address.');
  }
}

app.use('/public', blockPublicIP, express.static('public'));

//app.use(express.static('public'));

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



async function getTable(params, outs){

  //.input('fechaInicio', params.fechaInicio)
  //.input('fechaFin',params.fechaFin)

  const f = params.columns === undefined ? "*" : params.columns;
  const q = "select "+f+" from " + params.table ;
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
}






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





//getVIS_Calcular_KPI_FillRate
//getVIS_Calcular_KPI_Venta_FillRate
//getVIS_Calcular_KPI_OOS_FillRate
//getVIS_Calcular_KPI_PedidosPendientes

//fill rate
//pedidos tarde
//pedidos masivos
//cump produccion ¡¡
//cump abasto
//oos
//deficit flota
// venta


// prod -> abasto -> oos ->
//         def flota ->
//        -> pedidos tarde
//              -> masivos




//getVIS_Calcular_KPI_Flota_FillRate


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



// abasto, producc, ventas, oos, deficit flota
// fill rate tabla
// pedidos pend tabla
// masivos < fill rate

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`VisualCEMEX Middleware Server , corriendo escuchando en puerto : ${port}!`);
});
