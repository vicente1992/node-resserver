const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let categoriSchema = new Schema({
  discripcion: {
    type: String,
    unique: true,
    required: [true, 'El campo descripcion es  obligatorio']
  },
  usuario: {
    type: Schema.Types.ObjectId, ref: 'Usuario'
  }
});

module.exports = mongoose.model('Categoria', categoriSchema);