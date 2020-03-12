require('./config/config')
const express = require('express')
const app = express();
const bodyPaerser = require('body-parser');
const mongoose = require('mongoose');




app.use(bodyPaerser.urlencoded({ extended: false }));
app.use(bodyPaerser.json());

//Configuraciín global de rutas
app.use(require('./routes/index'));




//Database 
mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
  if (err) throw err;
  console.log('Conexión exitosa');
})

app.listen(process.env.PORT, () => {

  console.log(`Server on port `, process.env.PORT);

});

//Viene la clase #8