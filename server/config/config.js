//====================
//Puerto
//====================
process.env.PORT = process.env.PORT || 3000;

//====================
//Entorno
//====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
//Vencimiento del token
//====================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//====================
//SEED de autenticación
//====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



//====================
//BD
//====================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_DB;
}

process.env.urlDB = urlDB;

//====================
//Google client ID
//====================


process.env.CLIENT_ID = process.env.CLIENT_ID || '67477700973-q5e1tbqotd8cjffl7agk56bihrcm8env.apps.googleusercontent.com';

