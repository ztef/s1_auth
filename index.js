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
 


const app = express();
var router = express.Router();


app.use(cors());
router.use(cors());
app.use("/",router);



router.get('/',(_req, res) => {
    res.sendFile(__dirname + "/main.html");
});

router.get('/query',(_req, res) => {  
    res.sendFile(__dirname + "/query.html");
});

router.get('/get',(_req, res) => {  
  res.sendFile(__dirname + "/get.html");
});



async function getData(params, outs){


  const q = "select Unidad_de_Negocio, ZonaTransporte, Cliente, Frente, dtDestara, dtLlegaCte, CantSolfinal, CantEntfinal,Estatus_Entrega_Orig_2,EstadoZTDem, RegionZTDem, vc50_UN_Tact from Vis_FillRate";
  const w =" where dtDestara between '2023-05-01' and '2023-05-31';"


  try {  
  await sql.connect('Server=10.26.192.9,1483;Database=Cubo_CMP;User Id=command_shell;Password=devitnl76;Encrypt=false; parseJSON=false ')
  
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



async function getStoredProc(params, outs){


  
  var r = await sql.connect('Server=10.26.192.9,1483;Database=Cubo_CMP;User Id=command_shell;Password=devitnl76;Encrypt=false; parseJSON=false ').then(
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

router.get('/getSP',(req, res) => {

  let inicio = moment();
  console.log("Llamada a SP : ");
  console.log(req.query);
   
  res.setHeader('Content-Type', 'application/json');

  getStoredProc(req.query,res).then((datos)=>{
           
            res.setHeader('Content-Type', 'application/json');
            
            let medio = moment()
            try{
             if(datos){
              res.end(JSON.stringify(datos))
              } else {
                res.end({'error':datos})
              }
            } catch {
              res.end({'error':'unknown'})
            }

            let fin = moment()
            console.log("Respondiendo SP en : ", fin.diff(inicio));

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
            res.end(JSON.stringify(datos.recordset))

            let fin = moment()
            console.log("Respondiendo query en : ", fin.diff(inicio));

    });


});



const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`VisualCEMEX Middleware Server , corriendo escuchando en puerto : ${port}!`);
});

