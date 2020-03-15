const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();

let Categoria = require('../models/Categoria');


//Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

  Categoria.find({}).sort('discripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        categorias
      })
    })



});

//Mostrar una categoria por ID
app.get('/categoria/:id', (req, res) => {
  const id = req.params.id;
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        message: 'EL ID no se encuentra en la base de datos'
      });
    }
    res.json({
      ok: true,
      categoriaDB
    })
  })
});

//Crea nueva categoria
app.post('/categoria', verificaToken, (req, res) => {

  let body = req.body;
  let categoria = new Categoria({
    discripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
});
//Actualiza la categoria
app.put('/categoria/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;


  const desCategoria = {
    discripcion: body.descripcion
  }

  Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    } else {
      res.json({
        ok: true,
        categoria: categoriaDB

      });
    }


  })

});
//Borra la categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;
  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });

    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        message: 'El ID no existe'
      });
    } else {
      res.json({
        ok: true,
        message: 'Categoria Delete'
      })
    }

  })
});

module.exports = app;