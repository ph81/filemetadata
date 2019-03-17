const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// using Formidable to deal with multipart files
const formidable = require('formidable');
// port number
const port = 3000;
//setting host
const host = "https://localhost/";

const app = express();

app.use(cors());
// set static folder
app.use(express.static('public'));

// to parse application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/submit-form', function(req, res) {
  //parsing form
  const form = new formidable.IncomingForm();

  form.parse(req);

  form.
  on('fileBegin', function (name, file){
    file.path = __dirname + '/uploads/' + file.name;
  })
  .on('file', function (name, file){
      res.send({'File name': file.name, 'file size': file.size});
  })
  .on('aborted', () => {
    res.send('Request aborted by the user')
  })
  .on('error', (err) => {
    res.send(err);
  });
   //res.send('new file');
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
});

const listener = app.listen(process.env.PORT || port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

module.exports = app;
