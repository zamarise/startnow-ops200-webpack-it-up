const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

app.use(morgan('dev'));
app.use(express.static(publicDir));
app.use(express.static(distDir));

app.listen(3000, function () {
  console.log('server running at http://localhost:3000');
});
