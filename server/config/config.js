
process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb+srv://vic_ortiz:1992@cluster0-cnnt0.mongodb.net/test?retryWrites=true&w=majority';
}

process.env.urlDB = urlDB;