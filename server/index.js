const path = require('path');
const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));

const PORT = 3000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
