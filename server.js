const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const {
  crearBaseDeDatos,
  crearColeccion,
  insertarDocumento,
  querySimple,
  
} = require('./mongoOperations');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/basedatos', (req, res) => {
  async function ejecutarOperaciones() {
  await crearBaseDeDatos();
  await crearColeccion('Productos');
  await insertarDocumento('Productos', { id: req.body.id, price: req.body.price, name: req.body.name , description: req.body.description});
  }
  console.log('id:', req.body.id, '\nprice: ', req.body.price, '\nname: ', req.body.name, '\ndescription: ', req.body.description);
  res.send(req.body);
  ejecutarOperaciones().catch(console.error);
});

const {
  actualizarDocumento
} = require('./mongoOperations');

app.post('/update', (req, res) => {
  fetch('http://localhost:3000/update', {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: req.body.id,
      price: req.body.price,
      name: req.body.name,
      description : req.body.description,
    }),
  }).then((response) => response.text())
    .then((result) => {
      console.log("Result: ", result);
      res.send(result);
    })
  });

app.patch('/update', async (req) => {
  await actualizarDocumento('Productos', { id: req.body.id } , {price: req.body.price , name: req.body.name, description: req.body.description });
});
const {
  borrarDocumento
} = require('./mongoOperations');

app.post('/delete', (req, res) => {
  fetch('http://localhost:3000/delete', {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: req.body.name
    }),
  }).then((response) => response.text())
    .then((result) => {
      console.log("Result: ", result);
      res.send(result);
    })
  });

app.delete('/delete', async (req) => {
  await borrarDocumento('Productos', { name: req.body.name });
  console.log("Delete: ", req.body.name)
});

app.get('/buscarporprecio', async (req, res) => {
  const price = req.query.price;
  const query = { price: price};
  const result = await querySimple('Productos', query);
  console.log("Documento: ", result);
  res.status(200).json(result);
});

app.get('/buscarpornombre', async (req, res) => {
  const name = req.query.name;
  const query = { name: name};
  const result = await querySimple('Productos', query);
  console.log("Documento: ", result);
  res.status(200).json(result);
});

app.listen(3000);