const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Producto = require('../models/Producto');

const app = express();


//Obtener todos los productos
app.get('/producto', verificaToken, (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'discripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.status(201).json({
        ok: true,
        productos
      })
    })
});

//Obtener un productos por su ID
app.get('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id;


  Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'discripcion')
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'ID no encontrado'
          }
        });
      }
      res.json({
        ok: true,
        producto: productoDB
      })
    })
});
//Buscar productos

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
  const termino = req.params.termino;
  let regex = new RegExp(termino, 'i')
  Producto.find({ nombre: regex })
    .populate('categoria', 'discripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err: {
            message: 'ID no encontrado'
          }
        });
      }
      res.json({
        ok: true,
        producto: productos
      })
    })

});
//Crear un producto productos
app.post('/producto', verificaToken, (req, res) => {
  let body = req.body;
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id

  });


  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    res.status(201).json({
      ok: true,
      producto: productoDB
    })
  })



});

//Actualiza productos
app.put('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  const productoUpdate = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    discripcion: body.discripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  }


  Producto.findByIdAndUpdate(id, productoUpdate, (err, productGuardado) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productGuardado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no existe'
        }
      });
    } else {

      res.json({
        ok: true,
        message: 'Producto actualizado exitosamente',
        producto: productGuardado

      });
      console.log(productGuardado);

    }
  })
});

//Elimina productos
app.delete('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'ID no existe'
        }
      });
    }
    productoDB.disponible = false;
    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        producto: productoBorrado,
        message: 'Producto borrado'
      })
    })



  })
});

module.exports = app;