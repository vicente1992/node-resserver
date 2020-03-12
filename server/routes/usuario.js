
const express = require('express')
const app = express();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);
  Usuario.find({ estado: true }, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      Usuario.count({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo
        });

      })
    });
});

app.post('/usuario', (req, res) => {

  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    //usuarioDB.password = null;
    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

});
app.put('/usuario/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre',
    'email',
    'img',
    'role',
    'estado']);

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    } else {
      res.json({
        ok: true,
        usuario: usuarioDB
      });
    }



  })

});
app.delete('/usuario/:id', (req, res) => {
  let id = req.params.id;
  // Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {
  let cambiaStado = {
    estado: false
  }
  Usuario.findByIdAndUpdate(id, cambiaStado,
    { new: true }, (err, usuarioDelete) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      };
      if (!usuarioDelete) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario no encontrado'
          }
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDelete
      })
    })

});

module.exports = app;