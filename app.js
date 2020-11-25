const express = require('express');
const mysql = require('mysql2');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(function(req,res,next) {
   res.header("Access-Control-Allow-Origin", "*") ;
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept") ;
   next();
})

app.use(bodyParser.json());

// MySql 
const connection = mysql.createPool({
  connectionLimit : 10,
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'bea31c86aa6bb6',
  password: '7fdc6b3c',
  database: 'heroku_0eb452ce40aa78c'
});

// mysql://bea31c86aa6bb6:7fdc6b3c@us-cdbr-east-02.cleardb.com/heroku_0eb452ce40aa78c?reconnect=true
  
// Detalle
app.get('/detalles', (req, res) => {
    const sql = 'SELECT * FROM descripciones';

    connection.query(sql, (error, results) => {
      res.json(results);
    });
});

app.get('/detalles/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM descripciones WHERE id = ${id}`;
    connection.query(sql, (error, result) => {
      if (result.length > 0) {
        res.json(result);
      } else {
        res.status(404).json({
          mensaje: "no encontre el id: " + id,
          path: "/detalles/" + id,
          time: new Date().getDate()
        });
      }
    });
});


app.post('/detalles', (req, res) => {
    const sql = 'INSERT INTO descripciones SET ?';

    const customerObj = {
      segmento: req.body.segmento,
      puerta: req.body.puerta,
      llantas: req.body.llantas,
      trammision: req.body.trammision,
      color: req.body.color,
      vidrios: req.body.vidrios,
      tapizado: req.body.tapizado,
      motor: req.body.motor,
      direccion: req.body.direccion
  };

  connection.query(error, customerObj, result => {
    customerObj.id = result.insertId;
    res.status(201).json(customerObj);
  });
});

app.put('/detalle/:id', (req, res) => {
    const { id } = req.params;
    const { segmento, puerta,llantas,trammision,color,vidrios,tapizado,motor, direccion } = req.body;
    const sql = `UPDATE descripciones SET segmento='${segmento}',puerta='${puerta}',llantas='${llantas}',trammision='${trammision}',color='${color}',vidrios='${vidrios}',tapizado='${tapizado}',motor='${motor}',direccion='${direccion}' WHERE id =${id}`;
    
    connection.query(sql, fields => {
      res.json(fields);
    });
});

app.delete('/detalle/:id', (req, res) => {
    
    const { id } = req.params;
    const sql = `DELETE FROM descripciones WHERE id= ${id}`;
  
    connection.query(sql, error => {
      res.status(204);
    });

});   

  app.listen(PORT, () => {
    console.log(`Server en puerto ${PORT}`);
    /*Check conneccion
    connection.connect(error => {
      if (error) throw error;
      console.log('Base de datos ejecutandose!');
    });*/
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) throw error;
      console.log('The solution is: ', results[0].solution);
    });
  });