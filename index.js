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





router.get('/getData',(req, res) => {

  let inicio = moment();
  console.log("Recibiendo query : ");
  console.log(req.body);
   
  res.setHeader('Content-Type', 'application/json');

  getData(req.body,res).then((datos)=>{
           
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

